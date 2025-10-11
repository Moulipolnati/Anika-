import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SizeGuidePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Size Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive sizing guide
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Saree Size Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Saree Size Guide
                <Badge variant="secondary">Standard</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Most sarees are designed to fit all sizes with proper draping. Standard saree dimensions:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Length:</strong> 5.5 to 6 meters (standard)</li>
                  <li>• <strong>Width:</strong> 1.06 to 1.25 meters</li>
                  <li>• <strong>Blouse Piece:</strong> 0.8 to 1 meter included</li>
                </ul>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-sm"><strong>Note:</strong> Blouse fitting is customizable based on your measurements. Please provide accurate measurements when ordering.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lehenga Size Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Lehenga Size Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Size</th>
                      <th className="border border-border p-3 text-left">Bust (inches)</th>
                      <th className="border border-border p-3 text-left">Waist (inches)</th>
                      <th className="border border-border p-3 text-left">Hip (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">XS</td>
                      <td className="border border-border p-3">32-33</td>
                      <td className="border border-border p-3">24-25</td>
                      <td className="border border-border p-3">34-35</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">S</td>
                      <td className="border border-border p-3">34-35</td>
                      <td className="border border-border p-3">26-27</td>
                      <td className="border border-border p-3">36-37</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">M</td>
                      <td className="border border-border p-3">36-37</td>
                      <td className="border border-border p-3">28-29</td>
                      <td className="border border-border p-3">38-39</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">L</td>
                      <td className="border border-border p-3">38-39</td>
                      <td className="border border-border p-3">30-31</td>
                      <td className="border border-border p-3">40-41</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">XL</td>
                      <td className="border border-border p-3">40-41</td>
                      <td className="border border-border p-3">32-33</td>
                      <td className="border border-border p-3">42-43</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">XXL</td>
                      <td className="border border-border p-3">42-44</td>
                      <td className="border border-border p-3">34-36</td>
                      <td className="border border-border p-3">44-46</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Kurta Size Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Kurta Size Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Size</th>
                      <th className="border border-border p-3 text-left">Bust (inches)</th>
                      <th className="border border-border p-3 text-left">Length (inches)</th>
                      <th className="border border-border p-3 text-left">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">S</td>
                      <td className="border border-border p-3">36</td>
                      <td className="border border-border p-3">42</td>
                      <td className="border border-border p-3">14</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">M</td>
                      <td className="border border-border p-3">38</td>
                      <td className="border border-border p-3">43</td>
                      <td className="border border-border p-3">15</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">L</td>
                      <td className="border border-border p-3">40</td>
                      <td className="border border-border p-3">44</td>
                      <td className="border border-border p-3">16</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">XL</td>
                      <td className="border border-border p-3">42</td>
                      <td className="border border-border p-3">45</td>
                      <td className="border border-border p-3">17</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">XXL</td>
                      <td className="border border-border p-3">44</td>
                      <td className="border border-border p-3">46</td>
                      <td className="border border-border p-3">18</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Measurement Tips */}
          <Card>
            <CardHeader>
              <CardTitle>How to Measure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Bust Measurement</h4>
                  <p className="text-sm text-muted-foreground">Measure around the fullest part of your chest, keeping the tape parallel to the ground.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Waist Measurement</h4>
                  <p className="text-sm text-muted-foreground">Measure around your natural waist, which is the narrowest part of your torso.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Hip Measurement</h4>
                  <p className="text-sm text-muted-foreground">Measure around the fullest part of your hips, keeping the tape parallel to the ground.</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm"><strong>Custom Fitting Available:</strong> For the perfect fit, we offer custom tailoring services. Contact us with your measurements for a personalized fit.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SizeGuidePage;