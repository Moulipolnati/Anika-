import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const WishlistPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { wishlistItems, isWishlisted, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        navigate("/auth/login");
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  const handleAddToCart = (productId: string) => {
    const product = wishlistItems.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleBuyNow = (productId: string) => {
    const product = wishlistItems.find(p => p.id === productId);
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
          <p className="mt-4 text-muted-foreground">Loading your wishlist...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your saved favorites all in one place
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-muted-foreground mb-6">Your wishlist is empty 💔</p>
            <Button onClick={() => navigate("/shop")} size="lg">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
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
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default WishlistPage;