import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";
import { supabase } from "@/integrations/supabase/client";

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories(name)
          `)
          .eq('in_stock', true)
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) {
          console.error('Error fetching new arrivals:', error);
          return;
        }

        const formattedProducts = data?.map(product => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          discountPrice: product.discount_price ? Number(product.discount_price) : undefined,
          image: product.images?.[0] || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
          category: product.categories?.name || "Fashion"
        })) || [];

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading new arrivals...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <ProductSection
          title="New Arrivals"
          subtitle="Discover our latest collection of handpicked traditional wear"
          products={products}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default NewArrivalsPage;