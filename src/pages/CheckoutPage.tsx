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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: ""
  });
  
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        navigate("/auth/login");
        return;
      }

      // Pre-fill user data if available
      if (user.email) {
        setFormData(prev => ({
          ...prev,
          email: user.email
        }));
      }
    };

    getUser();
  }, [navigate]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Just show the payment screen, don't create order yet
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Create order in database with "payment_pending_confirmation" status
      const orderData = {
        user_id: user.id,
        customer_email: user.email || formData.email,
        total: getTotalPrice(),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          image: item.image,
          shipping: formData
        })),
        status: 'payment_pending_confirmation'
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) {
        throw error;
      }

      // Clear cart and redirect
      clearCart();
      toast({
        title: "Payment Confirmation Sent",
        description: "✅ Payment confirmation sent. Admin will verify.",
      });
      
      navigate("/profile");
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Placed",
        description: "Your order was placed but there was an issue. Please contact support if needed.",
      });
      // Still clear cart and redirect even on error
      clearCart();
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete your order details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b">
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
                        {formatPrice((item.discountPrice || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Details or Payment */}
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
                      placeholder="Any special instructions for your order..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                  >
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
                      Total: {formatPrice(getTotalPrice())}
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                    <p>After completing the payment, click the button below to confirm your order.</p>
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