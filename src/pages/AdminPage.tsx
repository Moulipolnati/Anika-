import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
const [uploading, setUploading] = useState(false);

const [productForm, setProductForm] = useState({
name: "",
description: "",
price: "",
discount_price: "",
category_id: "",
imageFile: null as File | null,
imageUrl: "",
in_stock: true,
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
const { data: userRole } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", session.user.id)
  .maybeSingle();

if (userRole?.role !== "admin") {
  toast({
    title: "Access Denied",
    description: "You don't have permission to access this page.",
    variant: "destructive",
  });
  navigate("/");
  return;
}

setUser(session.user);
await loadData();
};

const loadData = async () => {
try {
const { data: productsData } = await supabase
.from("products")
.select("*, categories(name)")
.order("created_at", { ascending: false });
setProducts(productsData || []);
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  setCategories(categoriesData || []);

  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  setOrders(ordersData || []);
} catch (error) {
  console.error("Error loading data:", error);
} finally {
  setLoading(false);
}
};

const handleImageUpload = async () => {
if (!productForm.imageFile) return null;
try {
  setUploading(true);
  const file = productForm.imageFile;
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl(uploadData.path);

  return publicUrlData.publicUrl;
} catch (error) {
  console.error("Image upload failed:", error);
  toast({
    title: "Image Upload Failed",
    description: "Please check bucket permissions and try again.",
    variant: "destructive",
  });
  return null;
} finally {
  setUploading(false);
}
};

const handleSubmitProduct = async (e: React.FormEvent) => {
e.preventDefault();
try {
  let imageUrl = productForm.imageUrl;

  if (productForm.imageFile) {
    const uploadedUrl = await handleImageUpload();
    if (uploadedUrl) imageUrl = uploadedUrl;
  }

  const productData = {
    name: productForm.name,
    description: productForm.description,
    price: parseFloat(productForm.price),
    discount_price: productForm.discount_price
      ? parseFloat(productForm.discount_price)
      : null,
    category_id: productForm.category_id || null,
    images: [imageUrl],
    in_stock: productForm.in_stock,
  };

  if (editingProduct) {
    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", editingProduct.id);

    if (error) throw error;
    toast({ title: "Product Updated Successfully" });
  } else {
    const { error } = await supabase.from("products").insert([productData]);
    if (error) throw error;
    toast({ title: "Product Added Successfully" });
  }

  setDialogOpen(false);
  setEditingProduct(null);
  setProductForm({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category_id: "",
    imageFile: null,
    imageUrl: "",
    in_stock: true,
  });

  await loadData();
} catch (error: any) {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
}
};

const handleEditProduct = (product: Product) => {
setEditingProduct(product);
setProductForm({
name: product.name,
description: product.description,
price: product.price.toString(),
discount_price: product.discount_price?.toString() || "",
category_id: product.category_id || "",
imageFile: null,
imageUrl: product.images?.[0] || "",
in_stock: product.in_stock ?? true,
});
setDialogOpen(true);
};

const handleDeleteProduct = async (id: string) => {
if (!confirm("Delete this product?")) return;
const { error } = await supabase.from("products").delete().eq("id", id);
if (error)
toast({ title: "Delete failed", variant: "destructive" });
else {
toast({ title: "Product deleted" });
await loadData();
}
};

const updateOrderStatus = async (orderId: string, newStatus: string) => {
const { error } = await supabase
.from("orders")
.update({ status: newStatus })
.eq("id", orderId);
if (error) {
  toast({ title: "Failed to update order", variant: "destructive" });
} else {
  toast({ title: `Order marked as ${newStatus}` });
  await loadData();
}
};

const getStatusColor = (status: string) => {
switch (status) {
case "paid":
return "default";
case "pending":
case "payment_pending_confirmation":
return "secondary";
case "cancelled":
return "destructive";
default:
return "outline";
}
};

if (loading) {
return (
<div className="min-h-screen bg-background flex items-center justify-center">
<p>Loading admin dashboard...</p>
</div>
);
}

return (
<div className="min-h-screen bg-background">
<Header />
<div className="container mx-auto px-4 py-16">
<h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
    <Tabs defaultValue="products">
      <TabsList className="grid grid-cols-2 max-w-md">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
      </TabsList>

      {/* PRODUCTS TAB */}
      <TabsContent value="products" className="mt-6">
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Add or edit products</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: "",
                      description: "",
                      price: "",
                      discount_price: "",
                      category_id: "",
                      imageFile: null,
                      imageUrl: "",
                      in_stock: true,
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Discount Price</Label>
                      <Input
                        type="number"
                        value={productForm.discount_price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            discount_price: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={productForm.category_id}
                      onValueChange={(v) =>
                        setProductForm({ ...productForm, category_id: v })
                      }
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
                    <Label>Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setProductForm({
                          ...productForm,
                          imageFile: file,
                          imageUrl: file ? URL.createObjectURL(file) : "",
                        });
                      }}
                    />
                    {productForm.imageUrl && (
                      <img
                        src={productForm.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 mt-3 object-cover rounded-md border"
                      />
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading
                      ? "Uploading..."
                      : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border overflow-x-auto">
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
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/100"
                          }
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
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
                        <Badge
                          variant={product.in_stock ? "default" : "secondary"}
                        >
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

      {/* ORDERS TAB */}
      <TabsContent value="orders" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Orders</CardTitle>
            <CardDescription>Manage recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id.slice(0, 8)}</TableCell>
                      <TableCell>{order.customer_email}</TableCell>
                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status || "pending")}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status !== "paid" && (
                          <Button
                            size="sm"
                            className="bg-green-500 text-white mr-2"
                            onClick={() => updateOrderStatus(order.id, "paid")}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {order.status !== "cancelled" && (
                          <Button
                            size="sm"
                            className="bg-red-500 text-white"
                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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


