import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import anikaLogo from "@/assets/anika-logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={anikaLogo} alt="ANIKA Logo" className="h-12 w-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ANIKA
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Discover timeless elegance with ANIKA's curated collection of traditional and contemporary fashion. 
              Where heritage meets modern style.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/anika" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Facebook className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://instagram.com/anika" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://twitter.com/anika" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Twitter className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Shipping Info", href: "/shipping" },
                { name: "Returns", href: "/returns" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Categories</h3>
            <ul className="space-y-3">
              {[
                { name: "Sarees", href: "/category/sarees" },
                { name: "Lehengas", href: "/category/lehengas" },
                { name: "Kurtas", href: "/category/kurtas" },
                { name: "New Arrivals", href: "/new-arrivals" },
                { name: "Sale", href: "/sale" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Get in Touch</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@anika.com</span>
              </div>
              <div className="flex items-start space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span>123 Fashion Street, Delhi, India</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-foreground">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe for updates on new collections and exclusive offers
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                >
                  {loading ? "..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 ANIKA. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;