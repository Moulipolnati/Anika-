import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  isWishlisted?: boolean;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  onBuyNow?: (id: string) => void;
}

const ProductCard = ({
  id,
  name,
  price,
  discountPrice,
  image,
  category,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  onBuyNow,
}: ProductCardProps) => {
  const discountPercentage = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryFallback = (cat: string) => {
    const categoryLower = cat.toLowerCase();
    if (categoryLower.includes('saree')) return 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop';
    if (categoryLower.includes('lehenga')) return 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop';
    if (categoryLower.includes('kurta')) return 'https://images.unsplash.com/photo-1601925794239-8a5a6e0ca2c3?w=400&h=400&fit=crop';
    if (categoryLower.includes('jewelry') || categoryLower.includes('accessories')) return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop';
    return 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop';
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = getCategoryFallback(category);
          }}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {discountPercentage}% OFF
          </Badge>
        )}

        {/* Wishlist Button */}
        <Button
          variant="outline"
          size="icon"
          className={`absolute top-3 right-3 bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white transition-all duration-200 z-10 ${
            isWishlisted ? "text-primary bg-primary/10" : "text-foreground"
          }`}
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist?.(id);
          }}
        >
          <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        {/* Quick Actions - Shows on Hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(id);
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              onBuyNow?.(id);
            }}
          >
            Buy Now
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Category */}
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            {discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(discountPrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;