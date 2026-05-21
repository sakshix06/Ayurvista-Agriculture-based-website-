import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { MessageCircle, Send, X, Play, Heart, Sparkles, Cpu, Users, ArrowRight, Leaf, Activity } from "lucide-react";
import GlobalNavigation from "@/components/GlobalNavigation";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";


interface FeaturedPlantData {
  name: string;
  botanical: string;
  description: string;
  image: string;
  link: string;
  icon: string;
  color: string;
}

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const { t, lang } = useI18n();
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: t("chat.initial") }
  ]);

  // Showcase plants list matching the interactive bottom tabs
  const showcasePlants: FeaturedPlantData[] = [
    {
      name: lang === 'en' ? "Tulsi" : "तुलसी",
      botanical: "Ocimum sanctum",
      description: lang === 'en' ? "Boosts immunity, acts as a natural adaptogen, and supports respiratory health." : "प्रतिरक्षा बढ़ाता है, एक प्राकृतिक एडाप्टोजेन के रूप में कार्य करता है, और श्वसन स्वास्थ्य का समर्थन करता है।",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600",
      link: "/plant/5",
      icon: "🌿",
      color: "from-emerald-500/20 to-teal-500/10"
    },
    {
      name: lang === 'en' ? "Neem" : "नीम",
      botanical: "Azadirachta indica",
      description: lang === 'en' ? "Renowned for its powerful antiseptic, blood purifying, and skin healing properties." : "अपने शक्तिशाली एंटीसेप्टिक, रक्त शोधक और त्वचा को ठीक करने वाले गुणों के लिए प्रसिद्ध है।",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600",
      link: "/plant/4",
      icon: "🌱",
      color: "from-green-500/20 to-emerald-500/10"
    },
    {
      name: lang === 'en' ? "Aloe Vera" : "एलोवेरा",
      botanical: "Aloe barbadensis miller",
      description: lang === 'en' ? "Helps in skin healing, improves digestion, hydrates deeply, and boosts overall immunity." : "त्वचा को ठीक करने में मदद करता है, पाचन में सुधार करता है, गहराई से हाइड्रेट करता है और समग्र प्रतिरक्षा को बढ़ाता है।",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=600",
      link: "/plant/8",
      icon: "🌵",
      color: "from-lime-500/20 to-emerald-500/10"
    },
    {
      name: lang === 'en' ? "Ashwagandha" : "अश्वगंधा",
      botanical: "Withania somnifera",
      description: lang === 'en' ? "A potent adaptogen that reduces stress, enhances vitality, and boosts energy levels." : "एक शक्तिशाली एडाप्टोजेन जो तनाव को कम करता है, जीवन शक्ति को बढ़ाता है और ऊर्जा के स्तर को बढ़ाता है।",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600",
      link: "/plant/9",
      icon: "🍃",
      color: "from-yellow-600/20 to-emerald-500/10"
    },
    {
      name: lang === 'en' ? "Giloy" : "गिलोय",
      botanical: "Tinospora cordifolia",
      description: lang === 'en' ? "Often called the root of immortality, it detoxifies, boosts defense, and treats chronic fever." : "अक्सर अमरता की जड़ कहा जाता है, यह विषहरण करता है, रक्षा बढ़ाता है और पुराने बुखार का इलाज करता है।",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600",
      link: "/plant/1",
      icon: "🍀",
      color: "from-green-600/20 to-teal-500/10"
    }
  ];

  const [activePlantIndex, setActivePlantIndex] = useState(2); // Aloe Vera is selected by default (index 2)
  const currentPlant = showcasePlants[activePlantIndex];
  const [isBookmarked, setIsBookmarked] = useState(false);

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
    <div className="min-h-screen relative text-white overflow-hidden bg-gradient-to-b from-[#060c07] via-[#0b170c] to-[#050a06]">
      {/* Background radial soft-glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-radial-glow opacity-60 pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial-glow opacity-40 pointer-events-none z-0" />
      
      {/* Animated floating SVG leaves in background */}
      <div className="absolute top-20 left-12 opacity-30 animate-float-slow z-0 pointer-events-none hidden md:block">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 22C2 22 8 20 12 16C16 12 20 8 22 2C22 2 16 4 12 8C8 12 2 18 2 22Z" fill="#a8e063" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/3 opacity-20 animate-float-medium z-0 pointer-events-none hidden lg:block">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#86efac" />
        </svg>
      </div>
      <div className="absolute bottom-40 left-1/3 opacity-25 animate-float-fast z-0 pointer-events-none hidden md:block">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8C8 8 4 12 2 22C12 20 16 16 17 8Z" fill="#a8e063" />
          <path d="M22 2C14 2 10 6 8 16C18 14 21 10 22 2Z" fill="#4ade80" />
        </svg>
      </div>
      <div className="absolute top-1/2 right-12 opacity-30 animate-float-slow z-0 pointer-events-none hidden md:block">
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 22C6 18 12 16 22 16C18 12 16 6 16 2C12 6 6 12 2 22Z" fill="#14532d" />
        </svg>
      </div>

      <GlobalNavigation />

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 z-10 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1">
          {/* Left Content Column */}
          <div className="space-y-8 lg:col-span-6 flex flex-col justify-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/20 text-[#a8e063] rounded-full py-1.5 px-4 w-fit shadow-md backdrop-blur-md">
              <Leaf className="w-3.5 h-3.5 fill-[#a8e063]/20" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Welcome to Ayurvista</span>
            </div>

            {/* Main Header Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
                Virtual Herbal<br />
                <span className="text-[#a8e063] text-glow-green inline-flex items-center gap-2">
                  Garden
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="w-10 h-10 inline-block fill-[#a8e063] animate-pulse">
                    <path d="M12 22C12 22 18 18 20 12C22 6 22 2 22 2C22 2 18 2 12 4C6 6 2 12 2 12C2 12 6 16 12 22Z" />
                  </svg>
                </span>
              </h1>
              <p className="text-zinc-300 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
                {t('home.subtitle')}
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link to="/virtual-tour">
                <Button className="bg-[#122415] hover:bg-[#1a3821] text-white font-bold rounded-full px-8 py-6 flex items-center space-x-3 shadow-lg border border-[#a8e063]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(168,224,99,0.25)]">
                  <Leaf className="h-5 w-5 text-[#a8e063]" />
                  <span>{t('home.startTour')}</span>
                </Button>
              </Link>

              <button className="flex items-center space-x-3 text-white font-semibold hover:text-[#a8e063] group transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-[#a8e063]/20 flex items-center justify-center border border-white/10 group-hover:border-[#a8e063]/30 transition-all duration-300">
                  <Play className="w-4 h-4 fill-white text-white group-hover:text-[#a8e063] group-hover:fill-[#a8e063]" />
                </div>
                <span className="text-sm font-bold tracking-wider uppercase">Watch Intro</span>
              </button>
            </div>
          </div>

          {/* Right Featured Plant Section Column */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            
            {/* Dashed vertical orbit arc with floating badges */}
            <div className="absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 h-[420px] w-24 border-r border-dashed border-emerald-500/25 rounded-full z-0 hidden sm:block pointer-events-none" />
            
            {/* Orbiting Plant Circular badges */}
            <div className="absolute right-[-2.5rem] top-12 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-lg animate-float-slow shadow-lg z-10 hover:border-[#a8e063]/50 cursor-pointer hidden lg:flex">
              🌱
            </div>
            <div className="absolute right-[-3.5rem] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-panel-glow flex items-center justify-center text-xl animate-float-medium shadow-lg z-10 hover:scale-110 transition-all cursor-pointer hidden lg:flex">
              🌸
            </div>
            <div className="absolute right-[-2.5rem] bottom-12 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-lg animate-float-fast shadow-lg z-10 hover:border-[#a8e063]/50 cursor-pointer hidden lg:flex">
              🌿
            </div>

            {/* Main Interactive Glass Showcase Container */}
            <div className="glass-panel-glow rounded-[2rem] p-6 sm:p-8 relative flex flex-col justify-between overflow-hidden w-full max-w-[480px] h-[520px] shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,224,99,0.15)] z-10">
              
              {/* Glow background behind the pot */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,224,99,0.06)_0%,transparent_65%)] pointer-events-none" />
              
              {/* Card Header Info */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2 bg-[#a8e063]/10 border border-[#a8e063]/20 rounded-full px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#a8e063]" />
                  <span className="text-[10px] font-bold tracking-widest text-[#a8e063] uppercase">Featured Plant</span>
                </div>
                <button 
                  onClick={() => {
                    setIsBookmarked(!isBookmarked);
                    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
                  }}
                  className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/70 hover:text-red-400 transition-colors shadow-sm cursor-pointer border border-white/5"
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? "fill-red-400 text-red-400" : ""}`} />
                </button>
              </div>

              {/* Center Scene: Plant in Ceramic Pot on Moss Platform */}
              <div className="flex-1 flex flex-col items-center justify-center relative select-none">
                
                {/* Embedded dynamic high-res visual plant or abstract beautiful botanical gradient */}
                <div className={`w-52 h-52 rounded-full bg-gradient-to-tr ${currentPlant.color} filter blur-2xl absolute opacity-60 animate-pulse`} />
                
                {/* High-quality pot graphic render */}
                <div className="relative z-10 transform hover:scale-105 transition-transform duration-500 flex flex-col items-center">
                  
                  {/* Real plant thumbnail styled as centerpiece */}
                  <img 
                    src={currentPlant.image} 
                    alt={currentPlant.name}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.5)] border-2 border-[#a8e063]/20 relative z-10" 
                  />

                  {/* Glass pedestal simulating the stone pot base */}
                  <div className="w-44 h-5 bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-full blur-[2px] opacity-75 shadow-2xl mt-[-10px] relative z-0 border border-white/10" />
                </div>
              </div>

              {/* Overlaid Float Glass Details Card (Floating inside the showcase right side) */}
              <div className="glass-card-dark rounded-2xl p-4 sm:p-5 absolute right-4 sm:right-6 top-20 w-[180px] sm:w-[220px] border border-white/10 z-20 flex flex-col space-y-2 shadow-2xl backdrop-blur-xl">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">{currentPlant.name}</h3>
                  <p className="text-[10px] text-[#a8e063] font-semibold italic opacity-90">{currentPlant.botanical}</p>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                  {currentPlant.description}
                </p>
                <Link to={currentPlant.link} className="pt-1">
                  <button className="flex items-center space-x-1 text-xs font-bold text-[#a8e063] hover:text-white transition-colors group">
                    <span>Explore Plant</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Bottom Interactive Miniature Horizontal Plant Tabs */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 border-t border-white/5 pt-4 z-10">
                {showcasePlants.map((plant, index) => (
                  <button
                    key={plant.name}
                    onClick={() => setActivePlantIndex(index)}
                    className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-300 ${
                      activePlantIndex === index 
                        ? "bg-[#a8e063]/15 border border-[#a8e063]/30 scale-105 shadow-md" 
                        : "glass-panel hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className="text-base sm:text-lg mb-1">{plant.icon}</span>
                    <span className={`text-[9px] font-bold truncate max-w-full ${
                      activePlantIndex === index ? "text-[#a8e063]" : "text-zinc-400"
                    }`}>
                      {plant.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Features Containers: Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-white/5 mt-10">
          
          {/* Bottom Left: Sleek Pill Stats Bar */}
          <div className="lg:col-span-7 flex justify-start w-full">
            <div className="glass-panel rounded-full py-4 px-6 sm:px-8 grid grid-cols-3 gap-6 sm:gap-8 items-center w-full max-w-2xl border border-white/5 shadow-2xl backdrop-blur-md">
              
              {/* Stat 1 */}
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-[#a8e063]/10 flex items-center justify-center shadow-md">
                  <Leaf className="w-5 h-5 text-[#a8e063]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black leading-none text-white">500+</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Medicinal Plants</p>
                </div>
              </div>
              
              {/* Stat 2 */}
              <div className="flex items-center space-x-3 border-l border-white/5 pl-4 sm:pl-6 hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-[#a8e063]/10 flex items-center justify-center shadow-md">
                  <Cpu className="w-5 h-5 text-[#a8e063]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black leading-none text-white">AI Powered</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Smart Detection</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center space-x-3 border-l border-white/5 pl-4 sm:pl-6 hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-[#a8e063]/10 flex items-center justify-center shadow-md">
                  <Users className="w-5 h-5 text-[#a8e063]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black leading-none text-white">10K+</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Happy Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right: Upgraded Chatbot launcher pill button widget */}
          <div className="lg:col-span-5 flex justify-end w-full">
            <div 
              onClick={() => setIsChatOpen(true)}
              className="glass-panel rounded-3xl p-4 flex items-center justify-between w-full max-w-[380px] border border-white/5 cursor-pointer hover:border-[#a8e063]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,224,99,0.1)] shadow-2xl backdrop-blur-md group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#a8e063]/25 flex items-center justify-center shadow-md border border-[#a8e063]/30 relative">
                  <MessageCircle className="w-5 h-5 text-[#a8e063] group-hover:scale-110 transition-transform" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#a8e063] border-2 border-[#0b170c] animate-ping" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">Ask Your Herbal Expert</h4>
                  <p className="text-[10px] text-zinc-400 leading-snug">Get instant answers to your herbal queries.</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#a8e063]/20 flex items-center justify-center border border-white/10 group-hover:border-[#a8e063]/30 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-white group-hover:text-[#a8e063]" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upgraded Chatbot Widget Drawer */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen && (
          <div className="glass-card-dark border border-[#a8e063]/25 rounded-2xl w-80 sm:w-96 h-[480px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            
            {/* Chat Header */}
            <div className="p-4 rounded-t-2xl flex items-center justify-between border-b border-white/5 bg-[#0e1f10]/80">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#a8e063]/20 flex items-center justify-center border border-[#a8e063]/40">
                  <Activity className="h-4 w-4 text-[#a8e063] animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white tracking-wide">{t("chat.header")}</span>
                  <span className="block text-[8px] text-[#a8e063] font-bold uppercase tracking-wider">AI Powered</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-zinc-400 hover:text-white p-1 h-auto hover:bg-white/5 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-hide bg-zinc-950/20">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.type === "user"
                        ? "bg-[#142d17] text-white border border-[#a8e063]/20 rounded-tr-none shadow-md"
                        : "glass-panel text-zinc-200 border border-white/5 rounded-tl-none shadow-md"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/5 bg-[#0a150c]/80">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder={t("chat.placeholder")}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-white/5 border-white/10 text-white rounded-full text-xs h-10 px-4 focus-visible:ring-1 focus-visible:ring-[#a8e063]"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="text-white hover:scale-105 rounded-full w-10 h-10 flex items-center justify-center p-0 shadow-lg border border-[#a8e063]/30 transition-all duration-200"
                  style={{ backgroundColor: '#142d17' }}
                >
                  <Send className="h-4 w-4 text-[#a8e063]" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;