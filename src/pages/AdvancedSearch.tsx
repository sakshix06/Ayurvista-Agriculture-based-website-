
import { useState } from "react";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedUse, setSelectedUse] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Advanced search:", { searchQuery, selectedFamily, selectedRegion, selectedUse });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ABC8A2' }}>
      <GlobalNavigation />
      
      <div className="bg-cover bg-center h-64 relative"
           style={{
             backgroundImage: "linear-gradient(rgba(26, 36, 23, 0.7), rgba(26, 36, 23, 0.7)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070')"
           }}>
        <div className="container mx-auto px-4 pt-32">
          <h1 className="text-5xl font-bold text-white mb-4">Advanced Plant Search</h1>
          <p className="text-xl text-white/90">
            Find specific medicinal plants using detailed search criteria
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2" style={{ color: '#1A2417' }} />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Plant Name or Scientific Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Neem, Azadirachta indica"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Plant Family</label>
                  <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plant family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meliaceae">Meliaceae (Mahogany family)</SelectItem>
                      <SelectItem value="lamiaceae">Lamiaceae (Mint family)</SelectItem>
                      <SelectItem value="asteraceae">Asteraceae (Daisy family)</SelectItem>
                      <SelectItem value="fabaceae">Fabaceae (Legume family)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Geographic Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tropical">Tropical</SelectItem>
                      <SelectItem value="subtropical">Subtropical</SelectItem>
                      <SelectItem value="temperate">Temperate</SelectItem>
                      <SelectItem value="arid">Arid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Medicinal Use</label>
                  <Select value={selectedUse} onValueChange={setSelectedUse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicinal use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="antiseptic">Antiseptic</SelectItem>
                      <SelectItem value="digestive">Digestive</SelectItem>
                      <SelectItem value="respiratory">Respiratory</SelectItem>
                      <SelectItem value="skin">Skin conditions</SelectItem>
                      <SelectItem value="immunity">Immunity booster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full text-white hover:opacity-90" style={{ backgroundColor: '#1A2417' }}>
                <Search className="mr-2" size={20} />
                Search Plants
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results Placeholder */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070" 
                    alt="Plant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Sample Plant {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Plant description and medicinal uses...</p>
                  <Button className="mt-4 w-full" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
