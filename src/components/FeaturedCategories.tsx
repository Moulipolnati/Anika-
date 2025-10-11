import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const FeaturedCategories = () => {
  const categories = [
    {
      id: "sarees",
      name: "Sarees",
      description: "Traditional elegance",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop",
      link: "/category/sarees"
    },
    {
      id: "lehengas",
      name: "Lehengas",
      description: "Festive grandeur",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
      link: "/category/lehengas"
    },
    {
      id: "kurtas",
      name: "Kurtas",
      description: "Everyday comfort",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e3629?w=400&h=300&fit=crop",
      link: "/category/kurtas"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-accent/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collections of traditional and contemporary fashion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} to={category.link} className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=300&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/90 group-hover:text-white transition-colors">
                      {category.description}
                    </p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;