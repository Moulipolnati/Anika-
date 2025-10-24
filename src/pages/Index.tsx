import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://lqpmhnhmexookmxxqcjh.supabase.co";

const Index = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // ✅ Fetch New Arrivals
      const { data: newProducts, error: newError } = await supabase
        .from("products")
        .select("id, name, price, discount_price, images, category_id, categories(name)")
        .eq("in_stock", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (newError) console.error("Error fetching new arrivals:", newError);

      // ✅ Fetch Best Selling
      const { data: bestProducts, error: bestError } = await supabase
        .from("products")
        .select("id, name, price, discount_price, images, category_id, categories(name)")
        .eq("in_stock", true)
        .order("discount_price", { ascending: false, nullsLast: true })
        .limit(8);

      if (bestError) console.error("Error fetching best selling:", bestError);

      // ✅ Clean image URLs
      const formatProducts = (data: any[]) =>
        (data || []).map((p) => {
          let imgUrl = "";
          if (p.images && p.images.length > 0 && p.images[0]) {
            const raw = p.images[0].trim();
            if (raw.startsWith("http")) imgUrl = encodeURI(raw);
            else if (raw.startsWith("products/"))
              imgUrl = `${SUPABASE_URL}/storage/v1/object/public/${encodeURI(raw)}`;
            else imgUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${encodeURI(raw)}`;
          }

          return {
            id: p.id,
            name: p.name,
            price: p.price,
            discountPrice: p.discount_price,
            image: imgUrl,
            category: p.categories?.name || "Fashion",
          };
        });

      setNewArrivals(formatProducts(newProducts));
      setBestSelling(formatProducts(bestProducts));
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedCategories />

      {loading ? (
        <p className="text-center text-gray-500 py-16">Loading products...</p>
      ) : (
        <>
          <ProductSection
            title="New Arrivals"
            subtitle="Discover our latest collection of handpicked traditional wear"
            products={newArrivals}
            viewAllLink="/new-arrivals"
          />

          <div className="bg-gradient-to-br from-secondary/5 via-background to-accent/5">
            <ProductSection
              title="Best Selling"
              subtitle="Customer favorites that define timeless elegance"
              products={bestSelling}
              viewAllLink="/bestsellers"
            />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Index;




