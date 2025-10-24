import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate } from "react-router-dom";

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const formattedProducts = productsData?.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        discountPrice: product.discount_price ? Number(product.discount_price) : undefined,
        image: product.images?.[0] || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
        category: product.categories?.name || "Fashion"
      })) || [];

      setProducts(formattedProducts);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // inside fetchData after fetching categoriesData
const formattedCategories = [
  { key: "all", label: "All Products", id: "all" },
  ...(categoriesData?.map(cat => ({
    key: cat.name.toLowerCase(),
    label: cat.name,
    id: cat.id   // include uuid
  })) || [])
];

setCategories(formattedCategories);


      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      category: "kurtis"
    },
    {
      id: "8",
      name: "Festive Anarkali Dress",
      price: 5999,
      discountPrice: 4499,
      image: "https://images.unsplash.com/photo-1606819999029-d73de02e2507?w=400&h=400&fit=crop",
      category: "kurtis"
    },
    {
      id: "9",
      name: "Casual Straight Kurta",
      price: 1999,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e3629?w=400&h=400&fit=crop",
      category: "kurtis"
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category.toLowerCase() === selectedCategory);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (isWishlisted(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(product);
    }
  };

  const handleBuyNow = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        {/* Category Filter */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Shop All Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover our complete collection of traditional wear
            </p>
            
{/* Category Buttons */}
<div className="flex flex-wrap justify-center gap-4">
  {categories.map((cat) => (
    <Button
      key={cat.id || cat.key}
      variant={selectedCategory === cat.id ? "default" : "outline"}
      onClick={() => {
  if (category.id && category.id !== "all") {
    navigate(`/category/${category.id}`); // ✅ Go by ID
  } else {
    setSelectedCategory("all");
  }
}}

      className="transition-all duration-300"
    >
      {cat.label}
    </Button>
  ))}
</div>


          </div>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {selectedCategory === "all" ? "All Products" : `${categories.find(c => c.key === selectedCategory)?.label}`}
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {filteredProducts.length} products found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const ProductCard = require("@/components/ProductCard").default;
              return (
                <ProductCard
                  key={product.id}
                  {...product}
                  isWishlisted={isWishlisted(product.id)}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onBuyNow={handleBuyNow}
                />
              );
            })}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShopPage;