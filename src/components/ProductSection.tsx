// src/components/ProductSection.tsx
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  images?: string[]; // normalized array
  category_name?: string;
  // also accept `image?: string` from callers (single-image field)
  image?: string;
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  filter?: "new" | "bestselling" | "featured";
  viewAllLink?: string;
  products?: any[]; // optional prop-driven products
}

const SUPABASE_URL = "https://lqpmhnhmexookmxxqcjh.supabase.co";

const ProductSection = ({
  title,
  subtitle,
  filter,
  viewAllLink,
  products: propProducts,
}: ProductSectionProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // helper to normalize a single product object (handles many shapes)
  const normalizeProduct = (p: any): Product => {
    // priority for image:
    // 1) p.image (single string)
    // 2) p.images (array with first element)
    // 3) if p.images is array of URLs/pathnames, normalize to full public URL
    let imagesArr: string[] = [];

    try {
      // if provided already normalized by caller
      if (typeof p.image === "string" && p.image.trim() !== "") {
        imagesArr = [p.image.trim()];
      } else if (Array.isArray(p.images) && p.images.length > 0) {
        // ensure strings and trim
        imagesArr = p.images.map((x: any) => (typeof x === "string" ? x.trim() : "")).filter(Boolean);
      }
    } catch (err) {
      imagesArr = [];
    }

    // If imagesArr contains relative paths (e.g., "products/abc.jpg" or "abc.jpg"),
    // convert them to Supabase storage public URL if needed.
    const normalizedImages = imagesArr.map((raw) => {
      if (!raw) return "";
      if (raw.startsWith("http")) return raw;
      // if it already contains "/storage/v1/object/public/" treat as full
      if (raw.includes("/storage/v1/object/public/")) return raw;
      // otherwise treat as object inside products bucket
      // NOTE: do NOT add trailing slash here — caller may already include "products/..."
      const cleaned = raw.startsWith("products/") ? raw : `products/${raw}`;
      // encode the path portion (spaces and special chars)
      const parts = cleaned.split("/").map((p) => encodeURIComponent(p));
      return `${SUPABASE_URL}/storage/v1/object/public/${parts.join("/")}`;
    }).filter(Boolean);

    return {
      id: String(p.id ?? ""),
      name: p.name ?? p.title ?? "Untitled",
      price: typeof p.price === "number" ? p.price : Number(p.price || 0),
      discount_price: p.discount_price !== undefined ? (typeof p.discount_price === "number" ? p.discount_price : Number(p.discount_price)) : undefined,
      images: normalizedImages,
      category_name: p.category_name || p.categories?.name || p.category || (p.category_id ? String(p.category_id) : ""),
      image: normalizedImages[0] || "", // convenience single-string
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      // If the parent passed `products` via props, use those (but normalize them).
      if (propProducts && Array.isArray(propProducts)) {
        const normalized = (propProducts || []).map((x) => normalizeProduct(x));
        setProducts(normalized);
        setLoading(false);
        console.log("⚡ ProductSection using propProducts (normalized):", normalized);
        return;
      }

      setLoading(true);
      try {
        let query = supabase
          .from("products")
          .select(`
            id,
            name,
            price,
            discount_price,
            images,
            category_id,
            categories(name)
          `)
          .eq("in_stock", true)
          .limit(8);

        switch (filter) {
          case "new":
            query = query.order("created_at", { ascending: false });
            break;
          case "bestselling":
            query = query.order("discount_price", { ascending: false, nullsLast: true });
            break;
          case "featured":
            query = query.order("price", { ascending: false });
            break;
          default:
            break;
        }

        const { data, error } = await query;
        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
          setLoading(false);
          return;
        }

        const formatted = (data || []).map((p: any) => {
          // Normalize mdb `images` values: some rows may already contain absolute URL strings,
          // some may contain "products/filename.jpg", some may contain only filename.
          return normalizeProduct({
            id: p.id,
            name: p.name,
            price: p.price,
            discount_price: p.discount_price,
            images: p.images,
            category_name: p.categories?.name,
            category_id: p.category_id,
          });
        });

        setProducts(formatted);
        console.log("⚡ ProductSection fetched and normalized:", formatted);
      } catch (err) {
        console.error("Unexpected error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, propProducts]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) addToCart(product as any);
  };

  const handleToggleWishlist = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (isInWishlist(productId)) await removeFromWishlist(productId);
    else await addToWishlist(product as any);
  };

  const handleBuyNow = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product as any);
      window.location.href = "/cart";
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                discountPrice={product.discount_price}
                // Pass the normalized single-image string (ProductCard expects string)
                image={product.image || ""}
                category={product.category_name || ""}
                isWishlisted={isInWishlist(product.id)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products available.</p>
        )}

        {viewAllLink && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              onClick={() => (window.location.href = viewAllLink)}
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;












