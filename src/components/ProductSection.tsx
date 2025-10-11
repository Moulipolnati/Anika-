import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { supabase } from "../../supabase/client";



interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  images: string[];
  category_id: string;
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  filter?: "new" | "bestselling" | "featured";
  viewAllLink?: string;
}

const ProductSection = ({ title, subtitle, filter, viewAllLink }: ProductSectionProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products directly from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*").eq("in_stock", true).limit(8);

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
      }

      const { data, error } = await query;
      if (error) console.error("Error fetching products:", error);
      else setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [filter]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) addToCart(product);
  };

  const handleToggleWishlist = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (isInWishlist(productId)) await removeFromWishlist(productId);
    else await addToWishlist(product);
  };

  const handleBuyNow = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
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

        {/* Loading state */}
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
                image={product.images?.[0] || ""}
                category={product.category_id}
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
