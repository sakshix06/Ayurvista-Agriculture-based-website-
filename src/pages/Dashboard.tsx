import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import GlobalNavigation from "@/components/GlobalNavigation";

const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: "Hello! I'm your herbal expert. How can I help you today?" }
  ]);


  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const userMessage = chatMessage;
      setChatMessages(prev => [...prev, { type: "user", message: userMessage }]);
      setChatMessage("");
      
      // Simulate AI response based on plant-related keywords
      setTimeout(() => {
        let aiResponse = "";
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('amla') || lowerMessage.includes('gooseberry')) {
          aiResponse = "Amla is rich in Vitamin C and antioxidants. It boosts immunity, improves digestion, promotes healthy skin and hair, supports heart health, and can help reduce blood sugar levels.";
        } else if (lowerMessage.includes('ginseng')) {
          aiResponse = "Ginseng is an adaptogenic herb that helps manage stress, enhances energy levels, boosts cognitive function, improves immunity, and supports overall vitality.";
        } else if (lowerMessage.includes('tulsi') || lowerMessage.includes('basil')) {
          aiResponse = "Tulsi (Holy Basil) is known for its adaptogenic properties. It helps reduce stress, supports respiratory health, boosts immunity, and has anti-inflammatory benefits.";
        } else if (lowerMessage.includes('turmeric')) {
          aiResponse = "Turmeric contains curcumin, a powerful anti-inflammatory compound. It supports joint health, boosts immunity, aids digestion, and has antioxidant properties.";
        } else if (lowerMessage.includes('neem')) {
          aiResponse = "Neem has antibacterial and antifungal properties. It's excellent for skin health, supports oral hygiene, boosts immunity, and helps purify blood.";
        } else if (lowerMessage.includes('ashwagandha')) {
          aiResponse = "Ashwagandha is an adaptogenic herb that helps reduce stress and anxiety, improves sleep quality, supports muscle strength, and enhances overall vitality.";
        } else {
          aiResponse = "I'm your AI herbal expert! I can help you with information about medicinal plants, their benefits, usage, and care. Ask me about specific herbs like Amla, Ginseng, Tulsi, Turmeric, Neem, or Ashwagandha.";
        }
        
        setChatMessages(prev => [...prev, { type: "bot", message: aiResponse }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalNavigation />

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Virtual Herbal Garden
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  Welcome to the Virtual Herbal Garden, where you can explore a vast 
                  collection of herbs and medicinal plants from the comfort of your home.
                </p>
              </div>
              
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200">
                Start The Virtual Tour
              </Button>
            </div>

            {/* Right Content - Plant Visuals */}
            <div className="relative">
              {/* Main Center Plant */}
              <div className="flex justify-center mb-8">
                <div className="w-80 h-60 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">🌿</span>
                    </div>
                    <p className="text-sm">Succulent Plant</p>
                  </div>
                </div>
              </div>

              {/* Decorative Plants */}
              <div className="absolute top-0 -left-4 lg:-left-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
              </div>
              
              <div className="absolute top-4 -right-4 lg:-right-12">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🍃</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col border">
            {/* Chat Header */}
            <div className="bg-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Herbal Expert</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-green-700 p-1 h-auto"
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
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Ask about herbs..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">Ask Your Herbal Expert</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
