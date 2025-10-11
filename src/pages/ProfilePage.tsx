import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LogOut, Package, User } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth/login");
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      // Always set profile (fallback to auth user data)
      setProfile(profileData || {
        id: session.user.id,
        name: session.user.user_metadata?.name || '',
        email: session.user.email || '',
        role: 'customer',
        created_at: session.user.created_at
      });

      // Fetch user role from user_roles table
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setUserRole(roleData);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      } else {
        setOrders(ordersData || []);
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out.",
    });
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "payment_pending_confirmation": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Paid";
      case "pending": return "Pending";
      case "payment_pending_confirmation": return "Awaiting Verification";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Profile Info */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">My Profile</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-lg">{profile?.name || profile?.email || "User"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <Badge variant={userRole?.role === "admin" ? "default" : "secondary"}>
                    {userRole?.role || "customer"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-lg">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No orders found. Start shopping to see your orders here!
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.total.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {order.items && typeof order.items === 'object' ? 
                            (Array.isArray(order.items) ? order.items.length : 
                             typeof order.items === 'object' ? Object.keys(order.items).length : 0) : 0} item(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;