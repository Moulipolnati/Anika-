import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface CartItem {
id: string;
user_id: string;
product_id: string;
quantity: number;
name?: string;
price?: number;
discount_price?: number;
image?: string;
category?: string;
}
const SUPABASE_URL =
"[https://lqpmhnhmexookmxxqcjh.supabase.co/storage/v1/object/public/products/](https://lqpmhnhmexookmxxqcjh.supabase.co/storage/v1/object/public/products/)";
const CartPage = () => {
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [loading, setLoading] = useState(true);
const userId = localStorage.getItem("user_id");
const formatPrice = (amount: number) =>
new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
minimumFractionDigits: 0,
}).format(amount);
// ✅ Fetch cart items from Supabase
const fetchCartItems = async () => {
try {
if (!userId) {
console.warn("⚠️ No user_id found in localStorage");
setLoading(false);
return;
}
  console.log("🛒 Fetching cart for user:", userId);

  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      id,
      user_id,
      product_id,
      quantity,
      products (
        name,
        price,
        discount_price,
        images,
        category_id,
        categories ( name )
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Error fetching cart:", error);
    setLoading(false);
    return;
  }

  console.log("✅ Raw cart data:", data);

  const formatted = (data || []).map((item: any) => {
    const product = item.products || {};
    const image =
      product.images?.[0]?.startsWith("http")
        ? product.images[0]
        : `${SUPABASE_URL}${encodeURIComponent(product.images?.[0] || "")}`;
    return {
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: product.name,
      price: product.price,
      discount_price: product.discount_price,
      image,
      category: product.categories?.name || "",
    };
  });

  setCartItems(formatted);
} catch (err) {
  console.error("⚠️ Unexpected error while fetching cart:", err);
} finally {
  setLoading(false);
}
};
useEffect(() => {
fetchCartItems();
}, []);
const updateQuantity = async (id: string, newQty: number) => {
const item = cartItems.find((i) => i.id === id);
if (!item || newQty < 1) return;
const { error } = await supabase
  .from("cart")
  .update({ quantity: newQty })
  .eq("id", id);

if (error) {
  alert("❌ Failed to update quantity");
  return;
}

alert("🛍️ Quantity updated in cart");
fetchCartItems();
};
const removeFromCart = async (id: string) => {
const { error } = await supabase.from("cart").delete().eq("id", id);
if (error) {
alert("❌ Failed to remove item");
return;
}
alert("🗑️ Item removed from cart");
fetchCartItems();
};
const clearCart = async () => {
const { error } = await supabase.from("cart").delete().eq("user_id", userId);
if (error) {
alert("❌ Failed to clear cart");
return;
}
alert("🧹 Cart cleared");
fetchCartItems();
};
const subtotal = cartItems.reduce((sum, item) => {
const price = item.discount_price || item.price || 0;
return sum + price * item.quantity;
}, 0);
const shipping = subtotal > 2000 ? 0 : 200;
const total = subtotal + shipping;
return (
<div className="min-h-screen bg-background">
<Header />
<div className="container mx-auto px-4 py-16">
<div className="max-w-6xl mx-auto">
<div className="flex items-center gap-3 mb-8">
<ShoppingBag className="h-8 w-8 text-primary" />
<h1 className="text-3xl font-bold">Shopping Cart</h1>
</div>
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Discover our beautiful collection and add items to your cart
            </p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Category: {item.category}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        {item.discount_price ? (
                          <>
                            <span className="text-lg font-bold">
                              {formatPrice(item.discount_price)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.price || 0)}
                            </span>
                            <Badge variant="secondary">
                              {Math.round(
                                ((item.price! - item.discount_price) / item.price!) * 100
                              )}
                              % OFF
                            </Badge>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            {formatPrice(item.price || 0)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 You've earned free shipping!
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  </div>
  <Footer />
</div>
);
};
export default CartPage;


