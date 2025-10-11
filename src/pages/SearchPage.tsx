import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('in_stock', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      if (error) {
        console.error('Error searching products:', error);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Search Products
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {searchParams.get("q") && (
            <p className="text-xl text-muted-foreground">
              {loading ? "Searching..." : `${products.length} results for "${searchParams.get("q")}"`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Searching products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isWishlisted={isWishlisted(product.id)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        ) : searchParams.get("q") && !loading ? (
          <div className="text-center py-16">
            <p className="text-2xl text-muted-foreground mb-6">No products found</p>
            <Button onClick={() => navigate("/shop")} size="lg">
              Browse All Products
            </Button>
          </div>
        ) : null}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchPage;