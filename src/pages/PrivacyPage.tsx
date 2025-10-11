import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Privacy Policy
          </h1>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>At ANIKA, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.</p>
            <h3 className="font-semibold">Information We Collect</h3>
            <p>We collect information you provide directly, such as when you create an account, make a purchase, or subscribe to our newsletter.</p>
            <h3 className="font-semibold">How We Use Your Information</h3>
            <p>We use your information to provide services, process orders, communicate with you, and improve our offerings.</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;