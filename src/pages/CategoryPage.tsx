import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  // Sample products data - will be replaced with Supabase data
  const allProducts = [
    {
      id: "1",
      name: "Elegant Silk Saree with Golden Border",
      price: 4999,
      discountPrice: 3999,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      category: "sarees"
    },
    {
      id: "2",
      name: "Traditional Banarasi Saree",
      price: 7999,
      discountPrice: 5999,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      category: "sarees"
    },
    {
      id: "3",
      name: "Party Wear Georgette Saree",
      price: 3999,
      discountPrice: 2999,
      image: "https://images.unsplash.com/photo-1611861043344-8ae97a0faca5?w=400&h=400&fit=crop",
      category: "sarees"
    },
    {
      id: "4",
      name: "Designer Lehenga with Embroidery",
      price: 8999,
      discountPrice: 6999,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
      category: "lehengas"
    },
    {
      id: "5",
      name: "Bridal Red Lehenga",
      price: 15999,
      discountPrice: 12999,
      image: "https://images.unsplash.com/photo-1606128016789-8b2c20b68e46?w=400&h=400&fit=crop",
      category: "lehengas"
    },
    {
      id: "6",
      name: "Royal Blue Lehenga Choli",
      price: 12999,
      discountPrice: 9999,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
      category: "lehengas"
    },
    {
      id: "7",
      name: "Premium Cotton Kurta Set",
      price: 2999,
      discountPrice: 1999,
      image: "https://images.unsplash.com/photo-1601925794239-8a5a6e0ca2c3?w=400&h=400&fit=crop",
      category: "kurtas"
    },
    {
      id: "8",
      name: "Festive Anarkali Dress",
      price: 5999,
      discountPrice: 4499,
      image: "https://images.unsplash.com/photo-1606819999029-d73de02e2507?w=400&h=400&fit=crop",
      category: "kurtas"
    },
    {
      id: "9",
      name: "Casual Straight Kurta",
      price: 1999,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e3629?w=400&h=400&fit=crop",
      category: "kurtas"
    }
  ];

  const categoryProducts = allProducts.filter(product => product.category === category);
  
  const categoryTitles: { [key: string]: string } = {
    sarees: "Sarees Collection",
    lehengas: "Lehengas Collection", 
    kurtas: "Kurtas Collection"
  };

  const categorySubtitles: { [key: string]: string } = {
    sarees: "Timeless elegance in every drape",
    lehengas: "Royal attire for special occasions",
    kurtas: "Comfort meets tradition"
  };

  if (!category || !categoryTitles[category]) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
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
          title={categoryTitles[category]}
          subtitle={categorySubtitles[category]}
          products={categoryProducts}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;