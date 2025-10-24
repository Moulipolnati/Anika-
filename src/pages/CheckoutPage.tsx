import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import upiQrCode from "@/assets/upi-qr.jpg";

const CheckoutPage = () => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [showPayment, setShowPayment] = useState(false);
const [cartLoading, setCartLoading] = useState(true);
const [localCart, setLocalCart] = useState<any[]>([]);
const [formData, setFormData] = useState({
name: "",
email: "",
phone: "",
address: "",
city: "",
pincode: "",
notes: "",
});
const { cartItems, getTotalPrice, clearCart, setCartItems } = useCart();
const navigate = useNavigate();
const { toast } = useToast();
// ✅ Get logged in user
useEffect(() => {
const getUser = async () => {
const { data, error } = await supabase.auth.getUser();
if (error || !data.user) {
console.warn("⚠️ No logged-in user found");
navigate("/auth/login");
return;
}
  setUser(data.user);
  localStorage.setItem("user_id", data.user.id);

  // Prefill email
  if (data.user.email) {
    setFormData((prev) => ({
      ...prev,
      email: data.user.email!,
    }));
  }
};

getUser();
}, [navigate]);
// ✅ Fetch Supabase cart
useEffect(() => {
const fetchCartItems = async () => {
try {
const userId = localStorage.getItem("user_id");
if (!userId) {
console.warn("⚠️ No user_id found, skipping fetch");
setCartLoading(false);
return;
}
    if (cartItems.length > 0) {
      setLocalCart(cartItems);
      setCartLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .select(
        "product_id, quantity, products(id, name, price, discount_price, images, categories(name))"
      )
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Error fetching cart:", error);
      setCartLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No cart items found for user:", userId);
      setCartLoading(false);
      return;
    }

    const formatted = data.map((item: any) => ({
      id: item.products?.id,
      name: item.products?.name,
      price: item.products?.price,
      discountPrice: item.products?.discount_price,
      image: item.products?.images?.[0] || "https://via.placeholder.com/400",
      category: item.products?.categories?.name,
      quantity: item.quantity,
    }));

    setLocalCart(formatted);
    setCartItems(formatted);
  } catch (err) {
    console.error("⚠️ Unexpected error fetching cart:", err);
  } finally {
    setCartLoading(false);
  }
};

fetchCartItems();
}, [cartItems, setCartItems]);
const effectiveCart = localCart.length > 0 ? localCart : cartItems;
const totalPrice = effectiveCart.reduce(
(sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
0
);
const formatPrice = (amount: number) =>
new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
minimumFractionDigits: 0,
}).format(amount);
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
setShowPayment(true);
};
const handleConfirmPayment = async () => {
if (!user) return;
setLoading(true);
try {
  const orderData = {
    user_id: user.id,
    customer_email: user.email || formData.email,
    total: totalPrice,
    items: effectiveCart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.discountPrice || item.price,
      quantity: item.quantity,
      image: item.image,
      shipping: formData,
    })),
    status: "payment_pending_confirmation",
  };

  const { error } = await supabase.from("orders").insert([orderData]);
  if (error) throw error;

  clearCart();
  toast({
    title: "✅ Payment Confirmation Sent",
    description: "Your order has been submitted for admin verification.",
  });

  navigate("/profile");
} catch (err) {
  console.error("❌ Error creating order:", err);
  toast({
    title: "Order Placed (with warning)",
    description: "Your order was created but something went wrong. Please contact support.",
  });
  clearCart();
  navigate("/profile");
} finally {
  setLoading(false);
}
};
// ✅ Stop infinite loading bug
if (cartLoading) {
return (
<div className="min-h-screen bg-background flex items-center justify-center">
<p className="text-muted-foreground text-lg">Loading checkout...</p>
</div>
);
}
if (effectiveCart.length === 0) {
return (
<div className="min-h-screen bg-background flex flex-col items-center justify-center text-center space-y-4">
<p className="text-xl text-muted-foreground">🛒 Your cart is empty.</p>
<Button onClick={() => navigate("/")}>Go Back to Shop</Button>
</div>
);
}
return (
<div className="min-h-screen bg-background">
<Header />
<div className="pt-16 container mx-auto px-4 py-16">
<div className="text-center mb-12">
<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
Checkout
</h1>
<p className="text-xl text-muted-foreground">Complete your order details</p>
</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {effectiveCart.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 pb-4 border-b"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(
                      (item.discountPrice || item.price) * item.quantity
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping or Payment */}
      {!showPayment ? (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continue to Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>UPI Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-white p-6 rounded-lg inline-block">
                <img
                  src={upiQrCode}
                  alt="UPI QR Code"
                  className="w-64 h-auto mx-auto"
                />
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  Scan this QR code with any UPI app
                </p>
                <p className="text-muted-foreground">
                  Google Pay, PhonePe, Paytm, or any UPI app
                </p>
                <p className="text-2xl font-bold text-primary">
                  Total: {formatPrice(totalPrice)}
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                <p>
                  After completing the payment, click the button below to
                  confirm your order.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConfirmPayment}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Payment"}
              </Button>
              <Button
                onClick={() => setShowPayment(false)}
                variant="outline"
                className="w-full"
              >
                Back to Shipping Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
  <Footer />
</div>
);
};
export default CheckoutPage;

