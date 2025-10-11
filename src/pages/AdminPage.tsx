import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Package, ShoppingCart } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

const AdminPage = () => {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category_id: "",
    images: "",
    in_stock: true
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      navigate("/auth/login");
      return;
    }

    // Check if user is admin via user_roles table
    const { data: userRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (roleError || userRole?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    setUser(session.user);
    await loadData();
  };

  const loadData = async () => {
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      
      setProducts(productsData || []);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      setCategories(categoriesData || []);

      // Fetch orders - select all fields including customer_email
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      }
      
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        category_id: productForm.category_id || null,
        images: productForm.images ? productForm.images.split(',').map(url => url.trim()) : [],
        in_stock: productForm.in_stock
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({
          title: "Product Updated",
          description: "Product has been updated successfully."
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Product Created",
          description: "New product has been added successfully."
        });
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        discount_price: "",
        category_id: "",
        images: "",
        in_stock: true
      });
      await loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount_price: product.discount_price ? product.discount_price.toString() : "",
      category_id: product.category_id || "",
      images: product.images.join(', '),
      in_stock: product.in_stock ?? true
    });
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully."
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("categories")
        .insert([categoryForm]);

      if (error) throw error;

      toast({
        title: "Category Created",
        description: "New category has been added successfully."
      });

      setCategoryDialogOpen(false);
      setCategoryForm({ name: "", description: "" });
      await loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "payment_pending_confirmation": return "secondary";
      case "pending": return "outline";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}.`
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage products, categories, and orders</p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Products Management
                    </CardTitle>
                    <CardDescription>Add, edit, or remove products</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Category</DialogTitle>
                          <DialogDescription>Create a new product category</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitCategory} className="space-y-4">
                          <div>
                            <Label htmlFor="cat-name">Category Name *</Label>
                            <Input
                              id="cat-name"
                              value={categoryForm.name}
                              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cat-desc">Description</Label>
                            <Textarea
                              id="cat-desc"
                              value={categoryForm.description || ""}
                              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            />
                          </div>
                          <Button type="submit" className="w-full">Create Category</Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: "",
                            description: "",
                            price: "",
                            discount_price: "",
                            category_id: "",
                            images: "",
                            in_stock: true
                          });
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingProduct ? "Edit Product" : "Add New Product"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingProduct ? "Update product details" : "Create a new product"}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitProduct} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                              id="description"
                              value={productForm.description}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                              required
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price">Price (₹) *</Label>
                              <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={productForm.price}
                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="discount_price">Discount Price (₹)</Label>
                              <Input
                                id="discount_price"
                                type="number"
                                step="0.01"
                                value={productForm.discount_price}
                                onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={productForm.category_id}
                              onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="images">Image URLs (comma-separated)</Label>
                            <Textarea
                              id="images"
                              value={productForm.images}
                              onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                              placeholder="https://lqpmhnhmexookmxxqcjh.supabase.co/storage/v1/object/public/products/red%20saree.jpg,https://lqpmhnhmexookmxxqcjh.supabase.co/storage/v1/object/public/products/lehenga.jpg"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="in_stock"
                              checked={productForm.in_stock}
                              onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })}
                              className="h-4 w-4"
                            />
                            <Label htmlFor="in_stock">In Stock</Label>
                          </div>
                          <Button type="submit" className="w-full">
                            {editingProduct ? "Update Product" : "Create Product"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.images[0] || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100&h=100&fit=crop"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            {(product as any).categories?.name || "Uncategorized"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                ₹{product.discount_price || product.price}
                              </div>
                              {product.discount_price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  ₹{product.price}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.in_stock ? "default" : "secondary"}>
                              {product.in_stock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Customer Orders
                </CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No orders found yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">
                              #{order.id.slice(0, 8)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.customer_email || "No email"}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              ₹{order.total.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(order.status || "pending")}>
                                {order.status?.replace(/_/g, ' ') || "pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(order.created_at || "").toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {Array.isArray(order.items) ? order.items.length : 0} item(s)
                            </TableCell>
                            <TableCell>
                              {(order.status === "payment_pending_confirmation" || order.status === "pending") && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateOrderStatus(order.id, "paid")}
                                  >
                                    ✅ Mark as Paid
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                  >
                                    ❌ Cancel Order
                                  </Button>
                                </div>
                              )}
                              {order.status === "paid" && (
                                <span className="text-sm text-muted-foreground">Confirmed</span>
                              )}
                              {order.status === "cancelled" && (
                                <span className="text-sm text-destructive">Cancelled</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
