import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
}

const ProductCard = ({
  id,
  name,
  price,
  discountPrice,
  image,
  category,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Load logged-in user_id from Supabase session
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data?.session?.user?.id || localStorage.getItem("user_id");
      if (uid) {
        setUserId(uid);
        localStorage.setItem("user_id", uid); // Save permanently
      }
    };
    fetchUser();
  }, []);

  // ✅ Wishlist toggle
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to login to manage your wishlist.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (isWishlisted) {
        await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", id);
        setIsWishlisted(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await supabase.from("wishlist").insert([
          {
            user_id: userId,
            product_id: id,
          },
        ]);
        setIsWishlisted(true);
        toast({ title: "Added to wishlist" });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Wishlist update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // ✅ Add to Cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to login to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🛒 Adding to cart:", { userId, product_id: id });

      // ✅ Check if product already exists in the user's cart
      const { data: existingCart } = await supabase
        .from("cart")
        .select("quantity")
        .eq("user_id", userId)
        .eq("product_id", id)
        .maybeSingle();

      if (existingCart) {
        await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + 1 })
          .eq("user_id", userId)
          .eq("product_id", id);
      } else {
        await supabase
          .from("cart")
          .insert([{ user_id: userId, product_id: id, quantity: 1 }]);
      }

      toast({ title: "Product added to cart" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Failed to add product to cart",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)} // <-- FIXED: template string with backticks!
      className="group relative border rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={image || "https://via.placeholder.com/400"}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow ${
            isWishlisted ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted ? "fill-red-500" : "group-hover:scale-110"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{category}</p>

        <div className="flex items-center gap-2 mb-3">
          {discountPrice ? (
            <>
              <span className="text-lg font-bold text-primary">₹{discountPrice}</span>
              <span className="text-sm text-gray-400 line-through">₹{price}</span>
            </>
          ) : (
            <span className="text-lg font-bold">₹{price}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;


















