import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";
import { supabase } from "@/integrations/supabase/client";

const SalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories(name)
          `)
          .eq('in_stock', true)
          .not('discount_price', 'is', null)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sale products:', error);
          return;
        }

        const formattedProducts = data?.map(product => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          discountPrice: Number(product.discount_price),
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

    fetchSaleProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading sale items...</p>
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
          title="Sale"
          subtitle="Don't miss out on these amazing deals"
          products={products}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default SalePage;