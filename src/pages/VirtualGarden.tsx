import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Search, MessageCircle, Send, X, Leaf, Info, Eye, ChevronRight } from "lucide-react";

interface Plant {
  id: number;
  name: string;
  scientificName: string;
  category: string;
  description: string;
  benefits: string[];
  image: string;
  isInteractive: boolean;
}

const VirtualGarden = () => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: "Welcome to AYUSH Virtual Herbal Garden! I can help you learn about medicinal plants. What would you like to explore?" }
  ]);

  const plants: Plant[] = [
    {
      id: 1,
      name: "Tulsi",
      scientificName: "Ocimum tenuiflorum",
      category: "Immunity",
      description: "Sacred basil with powerful healing properties",
      benefits: ["Boosts immunity", "Reduces stress", "Anti-inflammatory"],
      image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
      isInteractive: true
    },
    {
      id: 2,
      name: "Ashwagandha",
      scientificName: "Withania somnifera",
      category: "Stress Relief",
      description: "Adaptogenic herb for stress management",
      benefits: ["Reduces stress", "Improves energy", "Enhances focus"],
      image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png",
      isInteractive: true
    },
    {
      id: 3,
      name: "Neem",
      scientificName: "Azadirachta indica",
      category: "Skincare",
      description: "Natural antiseptic and skin healing agent",
      benefits: ["Antibacterial", "Skin healing", "Anti-inflammatory"],
      image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png",
      isInteractive: true
    },
    {
      id: 4,
      name: "Turmeric",
      scientificName: "Curcuma longa",
      category: "Anti-inflammatory",
      description: "Golden spice with curcumin benefits",
      benefits: ["Anti-inflammatory", "Antioxidant", "Joint health"],
      image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png",
      isInteractive: true
    },
    {
      id: 5,
      name: "Aloe Vera",
      scientificName: "Aloe barbadensis",
      category: "Skincare",
      description: "Succulent with healing gel properties",
      benefits: ["Skin healing", "Burns relief", "Moisturizing"],
      image: "/lovable-uploads/b3353135-a7cc-4a7f-861d-ffbce405151c.png",
      isInteractive: true
    },
    {
      id: 6,
      name: "Brahmi",
      scientificName: "Bacopa monnieri",
      category: "Brain Health",
      description: "Memory enhancing herb",
      benefits: ["Improves memory", "Reduces anxiety", "Brain tonic"],
      image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
      isInteractive: true
    }
  ];

  const categories = ["all", "Immunity", "Stress Relief", "Skincare", "Anti-inflammatory", "Brain Health"];

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const userMessage = chatMessage;
      setChatMessages(prev => [...prev, { type: "user", message: userMessage }]);
      
      // AI responses based on keywords
      let botResponse = "Thank you for your question! ";
      if (userMessage.toLowerCase().includes("tulsi")) {
        botResponse += "Tulsi is known as the 'Queen of Herbs' and is excellent for immunity and respiratory health.";
      } else if (userMessage.toLowerCase().includes("ashwagandha")) {
        botResponse += "Ashwagandha is a powerful adaptogen that helps reduce stress and improve energy levels.";
      } else if (userMessage.toLowerCase().includes("neem")) {
        botResponse += "Neem has powerful antibacterial properties and is excellent for skin health.";
      } else if (userMessage.toLowerCase().includes("turmeric")) {
        botResponse += "Turmeric contains curcumin, which has powerful anti-inflammatory and antioxidant properties.";
      } else {
        botResponse += "I can help you learn about various medicinal plants. Try asking about Tulsi, Ashwagandha, Neem, or Turmeric!";
      }
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: "bot", message: botResponse }]);
      }, 1000);
      
      setChatMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
      <GlobalNavigation />
      
      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Leaf className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AYUSH Virtual Herbal Garden</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Explore Nature's
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Pharmacy</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover the healing power of medicinal plants through our interactive virtual garden. 
            Learn about AYUSH traditions and explore nature's remedies.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-12 max-w-4xl mx-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-green-50 dark:hover:bg-green-900"
                  }`}
                >
                  {category === "all" ? "All Plants" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlants.map((plant) => (
              <Card 
                key={plant.id} 
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 overflow-hidden"
                onClick={() => setSelectedPlant(plant)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/90 dark:bg-gray-800/90 text-green-700 dark:text-green-300"
                    >
                      {plant.category}
                    </Badge>
                  </div>
                  {plant.isInteractive && (
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plant.name}</h3>
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-3">{plant.scientificName}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{plant.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {plant.benefits.slice(0, 2).map((benefit, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedPlant.image}
                alt={selectedPlant.name}
                className="w-full h-64 object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlant(null)}
                className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {selectedPlant.category}
                </Badge>
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Interactive Plant</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedPlant.name}
              </h2>
              <p className="text-lg italic text-gray-600 dark:text-gray-400 mb-4">
                {selectedPlant.scientificName}
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {selectedPlant.description}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="h-5 w-5 text-green-600" />
                  Health Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPlant.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  💡 Tip: Consult with an Ayurvedic practitioner before using medicinal plants
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 h-96 flex flex-col border dark:border-gray-700">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Leaf className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-medium">AYUSH Expert</span>
                  <div className="text-xs opacity-90">Online • Ask about plants</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-xl ${
                      msg.type === "user"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Ask about medicinal plants..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">AYUSH Expert</div>
              <div className="text-xs opacity-90">Ask about plants</div>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default VirtualGarden;