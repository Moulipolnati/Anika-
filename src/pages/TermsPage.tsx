import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>By using ANIKA's services, you agree to these terms and conditions.</p>
            <h3 className="font-semibold">Use of Our Services</h3>
            <p>You may use our services for lawful purposes only and in accordance with these terms.</p>
            <h3 className="font-semibold">Orders and Payments</h3>
            <p>All orders are subject to availability and confirmation. Payment must be made in full before delivery.</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;