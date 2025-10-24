import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductSection from "@/components/ProductSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Category {
id: string;
name: string;
description?: string;
}

interface Product {
id: string;
name: string;
price: number;
discount_price?: number;
images?: string[];
category_id: string;
in_stock?: boolean;
categories?: { name: string };
}

const SUPABASE_URL =
"https://lqpmhnhmexookmxxqcjh.supabase.co/storage/v1/object/public/products/";

const CategoryPage = () => {
const { category } = useParams();
const [categoryRow, setCategoryRow] = useState<Category | null>(null);
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchCategoryAndProducts = async () => {
if (!category) return;
setLoading(true);
  console.log("🔍 Fetching category for:", category);

  // Fetch category info
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, description")
    .ilike("name", category);

  if (categoryError) {
    console.error("Error fetching category:", categoryError);
    setLoading(false);
    return;
  }

  if (!categoryData || categoryData.length === 0) {
    console.warn("❌ No category found for:", category);
    setCategoryRow(null);
    setProducts([]);
    setLoading(false);
    return;
  }

  const foundCategory = categoryData[0];
  setCategoryRow(foundCategory);
  console.log("✅ Found category:", foundCategory);

  // Fetch products
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      "id, name, price, discount_price, images, category_id, in_stock, categories(name)"
    )
    .eq("category_id", foundCategory.id)
    .eq("in_stock", true);

  if (productsError) {
    console.error("Error fetching products:", productsError);
    setLoading(false);
    return;
  }

  console.log("📦 Raw product data (with images):", productsData);

  // Format image URLs
  const formattedProducts = (productsData || []).map((p: any) => {
    let imgUrl = "";

    if (p.images && p.images.length > 0 && p.images[0]) {
      const raw = p.images[0].trim();

      // ✅ Check if image is already a valid Supabase URL
      if (raw.startsWith("http")) {
        imgUrl = raw;
      } else {
        imgUrl = `${SUPABASE_URL}${encodeURIComponent(raw)}`;
      }

      console.log(`🖼️ Final image URL for ${p.name} => ${imgUrl}`);
    }

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      discount_price: p.discount_price,
      image: imgUrl,
      category: p.categories?.name || foundCategory.name,
    };
  });

  setProducts(formattedProducts);
  setLoading(false);
};

fetchCategoryAndProducts();
}, [category]);

if (loading)
return <p className="text-center text-gray-500 py-16">Loading category...</p>;

if (!categoryRow)
return (
<p className="text-center text-red-500 py-16">
Category not found: {category}
</p>
);

return (
<div className="min-h-screen bg-background">
<Header />
  <div className="text-center py-12 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {categoryRow.name} Collection
    </h1>
    {categoryRow.description && (
      <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
        {categoryRow.description}
      </p>
    )}
  </div>

  <ProductSection
    title={categoryRow.name}
    subtitle={`Explore our exclusive ${categoryRow.name} collection`}
    products={products}
  />

  <Footer />
</div>
);
};

export default CategoryPage;



















