import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About ANIKA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Where tradition meets contemporary fashion, creating timeless pieces that celebrate heritage and style.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a passion for preserving traditional Indian craftsmanship, ANIKA began as a dream to bridge the gap between heritage and modernity. Our journey started with a simple belief: every woman deserves to feel beautiful and confident in what she wears, whether it's a casual day out or a grand celebration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to creating exquisite traditional and contemporary fashion that empowers women to express their unique style. Every piece in our collection is carefully curated to ensure quality, comfort, and elegance, honoring the rich textile heritage of India while embracing modern design sensibilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-primary">Sarees</h3>
                  <p className="text-sm text-muted-foreground">
                    From traditional Banarasi to contemporary designer pieces
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-primary">Lehengas</h3>
                  <p className="text-sm text-muted-foreground">
                    Stunning bridal and festive wear for special occasions
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-primary">Kurtas</h3>
                  <p className="text-sm text-muted-foreground">
                    Comfortable yet elegant pieces for everyday wear
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Promise</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Quality fabrics and superior craftsmanship in every piece</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Ethically sourced materials and fair trade practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Excellent customer service and hassle-free returns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Supporting local artisans and traditional craftsmanship</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;