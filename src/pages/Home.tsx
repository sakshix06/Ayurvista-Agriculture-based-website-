import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { MessageCircle, Send, X } from "lucide-react";
import GlobalNavigation from "@/components/GlobalNavigation";
import { useI18n } from "@/i18n/I18nProvider";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const { t } = useI18n();
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: t("chat.initial") }
  ]);

  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      const current = chatMessage;
      setChatMessages([...chatMessages, { type: "user", message: current }]);
      setChatMessage("");
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: current })
        });
        const data = await res.json().catch(() => ({}));
        const reply = (data && data.reply) ? data.reply : t("chat.genericReply");
        setChatMessages((prev) => [...prev, { type: "bot", message: reply }]);
      } catch {
        setChatMessages((prev) => [...prev, { type: "bot", message: t("chat.genericReply") }]);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ABC8A2' }}>
      <GlobalNavigation />

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#1A2417' }}>
                  {t('home.title')}
                </h1>
                <p className="mt-6 text-lg leading-relaxed" style={{ color: '#1A2417' }}>
                  {t('home.subtitle')}
                </p>
              </div>
              
              <Link to="/virtual-tour">
                <Button className="text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 hover:opacity-90" style={{ backgroundColor: '#1A2417' }}>
                  {t('home.startTour')}
                </Button>
              </Link>
            </div>

            {/* Right Content - Plant Visuals */}
            <div className="relative">
              {/* Main Center Plant */}
              <div className="flex justify-center mb-8">
                <div className="w-80 h-60 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#1A2417' }}>
                  <div className="text-center" style={{ color: '#ABC8A2' }}>
                    <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#ABC8A2' }}>
                      <span className="text-4xl">🌿</span>
                    </div>
                    <p className="text-sm">Succulent Plant</p>
                  </div>
                </div>
              </div>

              {/* Decorative Plants */}
              <div className="absolute top-0 -left-4 lg:-left-12">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A2417' }}>
                  <span className="text-2xl">🌱</span>
                </div>
              </div>
              
              <div className="absolute top-4 -right-4 lg:-right-12">
                <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A2417' }}>
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
            <div className="text-white p-4 rounded-t-2xl flex items-center justify-between" style={{ backgroundColor: '#1A2417' }}>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{t("chat.header")}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:opacity-80 p-1 h-auto"
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
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                    style={msg.type === "user" ? { backgroundColor: '#1A2417' } : { backgroundColor: '#ABC8A2' }}
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
                  placeholder={t("chat.placeholder")}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: '#1A2417' }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#1A2417' }}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{t("chat.open")}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Home;