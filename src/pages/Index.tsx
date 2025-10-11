import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Sample product data - this will be replaced with real data from Supabase
  const newArrivals = [
    {
      id: "1",
      name: "Elegant Silk Saree with Golden Border",
      price: 4999,
      discountPrice: 3999,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      category: "Sarees"
    },
    {
      id: "2",
      name: "Designer Lehenga with Embroidery",
      price: 8999,
      discountPrice: 6999,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
      category: "Lehengas"
    },
    {
      id: "3",
      name: "Premium Cotton Kurta Set",
      price: 2999,
      discountPrice: 1999,
      image: "https://images.unsplash.com/photo-1601925794239-8a5a6e0ca2c3?w=400&h=400&fit=crop",
      category: "Kurtas"
    },
    {
      id: "4",
      name: "Festive Anarkali Dress",
      price: 5999,
      discountPrice: 4499,
      image: "https://images.unsplash.com/photo-1606819999029-d73de02e2507?w=400&h=400&fit=crop",
      category: "Kurtas"
    }
  ];

  const bestSelling = [
    {
      id: "5",
      name: "Traditional Banarasi Saree",
      price: 7999,
      discountPrice: 5999,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      category: "Sarees"
    },
    {
      id: "6",
      name: "Bridal Red Lehenga",
      price: 15999,
      discountPrice: 12999,
      image: "https://images.unsplash.com/photo-1606128016789-8b2c20b68e46?w=400&h=400&fit=crop",
      category: "Lehengas"
    },
    {
      id: "7",
      name: "Casual Straight Kurta",
      price: 1999,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e3629?w=400&h=400&fit=crop",
      category: "Kurtas"
    },
    {
      id: "8",
      name: "Party Wear Georgette Saree",
      price: 3999,
      discountPrice: 2999,
      image: "https://images.unsplash.com/photo-1611861043344-8ae97a0faca5?w=400&h=400&fit=crop",
      category: "Sarees"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedCategories />
      
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
      
      <Footer />
    </div>
  );
};

export default Index;
