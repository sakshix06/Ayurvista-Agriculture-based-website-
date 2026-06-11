import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlobalNavigation from "@/components/GlobalNavigation";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  MessageCircle,
  Send,
  X,
  Leaf,
  Info,
  Eye,
  ChevronRight,
  Trophy,
  Award,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

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
  const { toast } = useToast();
  
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: "Welcome to AYUSH Virtual Herbal Garden! I can help you learn about medicinal plants. What would you like to explore?" }
  ]);

  // Gamification States
  const [xp, setXp] = useState(450);
  const [points, setPoints] = useState(860);
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([]);
  const [achievement, setAchievement] = useState<{ plantName: string; xp: number; pts: number } | null>(null);

  // Daily Quiz States
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    // Load gamification data
    const savedXp = localStorage.getItem("ayurvista_journey_xp");
    const savedPoints = localStorage.getItem("herbal_points_balance");
    const savedExplored = localStorage.getItem("ayurvista_explored_plants");

    if (savedXp) setXp(Number(savedXp));
    if (savedPoints) setPoints(Number(savedPoints));
    if (savedExplored) {
      try {
        setDiscoveredIds(JSON.parse(savedExplored));
      } catch (e) {}
    }

    // Check if daily quiz was completed today
    const quizDate = localStorage.getItem("daily_quiz_completed_date");
    const today = new Date().toDateString();
    if (quizDate === today) {
      setQuizAnswered(true);
      setQuizCorrect(true);
    }
  }, []);

  const getLevelInfo = (currentXp: number) => {
    if (currentXp >= 600) return { title: "Gold Explorer", rank: 4, nextXp: 1000, progress: 100 };
    if (currentXp >= 350) return { title: "Herbal Researcher", rank: 3, nextXp: 600, progress: ((currentXp - 350) / 250) * 100 };
    if (currentXp >= 150) return { title: "Plant Explorer", rank: 2, nextXp: 350, progress: ((currentXp - 150) / 200) * 100 };
    return { title: "Beginner Herbalist", rank: 1, nextXp: 150, progress: (currentXp / 150) * 100 };
  };

  const levelInfo = getLevelInfo(xp);

  const handleConvertXp = () => {
    if (xp < 100) {
      toast({
        title: "Insufficient XP",
        description: "You need at least 100 XP to convert into points.",
        variant: "destructive"
      });
      return;
    }
    const xpToConvert = Math.floor(xp / 100) * 100;
    const pointsEarned = (xpToConvert / 100) * 10;
    
    const newXp = xp - xpToConvert;
    const newPoints = points + pointsEarned;

    setXp(newXp);
    setPoints(newPoints);

    localStorage.setItem("ayurvista_journey_xp", String(newXp));
    localStorage.setItem("herbal_points_balance", String(newPoints));
    
    const savedLifetime = localStorage.getItem("lifetime_points_earned");
    const currentLifetime = savedLifetime ? Number(savedLifetime) : 960;
    localStorage.setItem("lifetime_points_earned", String(currentLifetime + pointsEarned));

    toast({
      title: "XP Converted!",
      description: `Successfully converted ${xpToConvert} XP into ${pointsEarned} Herbal Points!`
    });
  };

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

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);

    // Trigger discover achievement if not already explored
    if (!discoveredIds.includes(plant.id)) {
      const newExplored = [...discoveredIds, plant.id];
      setDiscoveredIds(newExplored);
      localStorage.setItem("ayurvista_explored_plants", JSON.stringify(newExplored));

      const addedXp = 25;
      const addedPts = 3;
      const newXp = xp + addedXp;
      const newPoints = points + addedPts;

      setXp(newXp);
      setPoints(newPoints);

      localStorage.setItem("ayurvista_journey_xp", String(newXp));
      localStorage.setItem("herbal_points_balance", String(newPoints));

      const savedLifetime = localStorage.getItem("lifetime_points_earned");
      const currentLifetime = savedLifetime ? Number(savedLifetime) : 960;
      localStorage.setItem("lifetime_points_earned", String(currentLifetime + addedPts));

      // Display achievement popup
      setAchievement({
        plantName: plant.name,
        xp: addedXp,
        pts: addedPts
      });
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === "Curcumin";
    setQuizCorrect(isCorrect);
    setQuizAnswered(true);

    if (isCorrect) {
      const addedXp = 50;
      const addedPts = 5;
      const newXp = xp + addedXp;
      const newPoints = points + addedPts;

      setXp(newXp);
      setPoints(newPoints);

      localStorage.setItem("ayurvista_journey_xp", String(newXp));
      localStorage.setItem("herbal_points_balance", String(newPoints));
      localStorage.setItem("daily_quiz_completed_date", new Date().toDateString());

      const savedLifetime = localStorage.getItem("lifetime_points_earned");
      const currentLifetime = savedLifetime ? Number(savedLifetime) : 960;
      localStorage.setItem("lifetime_points_earned", String(currentLifetime + addedPts));

      toast({
        title: "Correct Answer! 🎉",
        description: `You earned +50 XP and +5 Herbal Points!`
      });
    } else {
      toast({
        title: "Wrong Answer",
        description: "Review your herbal knowledge and try again tomorrow!",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F5] text-[#1D3D18]">
      <GlobalNavigation />
      
      {/* HUD Header Bar */}
      <div className="pt-24 pb-4 px-4 bg-white border-b border-[#E1EDE4] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF2EC] text-[#2D6A4F] flex items-center justify-center text-xl border border-[#C5DCD0]">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm">{levelInfo.title}</span>
                <Badge className="bg-[#EAF2EC] text-[#2D6A4F] border border-[#C5DCD0] font-bold text-[9px] py-0.5 px-1.5">LVL {levelInfo.rank}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 sm:w-40 bg-gray-100 rounded-full h-2 overflow-hidden border border-[#E1EDE4]">
                  <div className="h-full bg-[#2D6A4F] transition-all" style={{ width: `${levelInfo.progress}%` }} />
                </div>
                <span className="text-[10px] font-black text-[#2D6A4F]">{xp} XP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Points Balance Counter */}
            <div className="bg-[#EAF2EC] border border-[#C5DCD0] rounded-xl px-4 py-2 flex items-center gap-2.5">
              <Award className="h-5 w-5 text-[#2D6A4F]" />
              <div>
                <p className="text-[10px] text-[#5C6E5A] font-bold uppercase leading-none">Herbal Points</p>
                <p className="text-base font-black text-[#1D3D18] leading-none mt-1">{points} pts</p>
              </div>
            </div>

            {/* Quiz Button */}
            <Button
              variant="outline"
              onClick={() => setQuizOpen(true)}
              className="border-[#C5DCD0] text-[#2D6A4F] hover:bg-[#EAF2EC] font-bold text-xs rounded-xl flex items-center gap-1.5 h-10 px-4"
            >
              <HelpCircle className="w-4 h-4" />
              Daily Herb Quiz
            </Button>

            {/* Convert XP Button */}
            {xp >= 100 && (
              <Button
                onClick={handleConvertXp}
                className="bg-[#1D3D18] hover:bg-[#2D6A4F] text-[#E2ECE9] font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Convert XP
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-white border border-[#E1EDE4] rounded-full px-6 py-2.5 mb-6 shadow-sm">
            <Leaf className="h-4 w-4 text-[#2D6A4F] mr-2 animate-pulse" />
            <span className="text-xs font-bold text-[#5C6E5A]">AYUSH Virtual Herbal Garden</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#1D3D18] mb-4">
            Explore Nature's
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D6A4F] to-[#a8e063]"> Pharmacy</span>
          </h1>
          
          <p className="text-sm text-[#5C6E5A] mb-8 max-w-2xl mx-auto font-medium">
            Explore medicinal plants to earn experience points (XP) and real shopping discounts!
            Click on interactive plant cards to discover benefits and earn Herbal Points.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-10 max-w-4xl mx-auto">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7A8C78] h-4 w-4" />
              <Input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-[#E1EDE4] rounded-xl h-10 text-xs focus:ring-[#2D6A4F]"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs font-bold rounded-xl h-9 px-4 border-[#C5DCD0] ${
                    selectedCategory === category 
                      ? "bg-[#1D3D18] hover:bg-[#2D6A4F] text-white" 
                      : "bg-white text-[#2D6A4F] hover:bg-[#EAF2EC]"
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
            {filteredPlants.map((plant) => {
              const isExplored = discoveredIds.includes(plant.id);
              
              return (
                <Card 
                  key={plant.id} 
                  className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-white border border-[#E1EDE4] rounded-2xl overflow-hidden"
                  onClick={() => handlePlantClick(plant)}
                >
                  <div className="relative overflow-hidden h-48 bg-white flex items-center justify-center p-4">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/95 border border-[#E1EDE4] text-[#2D6A4F] font-bold text-[9px]"
                      >
                        {plant.category}
                      </Badge>
                    </div>
                    {isExplored ? (
                      <div className="absolute top-4 left-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Discovered</span>
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4 bg-[#FFF9E6] border border-amber-200 text-amber-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 animate-pulse shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        <span>Unexplored</span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-5 border-t border-[#F0F6F1] space-y-3">
                    <div>
                      <h3 className="text-base font-extrabold text-[#1D3D18]">{plant.name}</h3>
                      <p className="text-xs italic text-[#7A8C78] mt-0.5">{plant.scientificName}</p>
                    </div>
                    
                    <p className="text-xs text-[#5C6E5A] line-clamp-2 leading-relaxed">{plant.description}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {plant.benefits.slice(0, 2).map((benefit, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-[9px] border-[#C5DCD0] text-[#2D6A4F] font-semibold px-2"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#7A8C78] group-hover:text-[#2D6A4F] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden border border-[#E1EDE4] shadow-2xl">
            <div className="relative h-64 bg-[#F4F8F5] flex items-center justify-center p-6">
              <img
                src={selectedPlant.image}
                alt={selectedPlant.name}
                className="max-h-full object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlant(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#1D3D18] p-1.5 h-auto rounded-full border border-[#E1EDE4]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-[#EAF2EC] text-[#2D6A4F] border border-[#C5DCD0] font-bold text-[10px]">
                  {selectedPlant.category}
                </Badge>
                <div className="w-1.5 h-1.5 bg-[#2D6A4F] rounded-full"></div>
                <span className="text-[10px] text-[#5C6E5A] font-bold uppercase">Interactive Plant</span>
              </div>
              
              <div>
                <h2 className="text-2xl font-black text-[#1D3D18]">{selectedPlant.name}</h2>
                <p className="text-xs italic text-[#7A8C78] mt-1">{selectedPlant.scientificName}</p>
              </div>
              
              <p className="text-xs text-[#5C6E5A] leading-relaxed">
                {selectedPlant.description}
              </p>
              
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-[#1D3D18] flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#2D6A4F]" />
                  Health Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPlant.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2.5 p-2.5 bg-[#F4F8F5] border border-[#E1EDE4] rounded-xl text-xs"
                    >
                      <div className="w-1.5 h-1.5 bg-[#2D6A4F] rounded-full flex-shrink-0"></div>
                      <span className="text-[#5C6E5A] font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#F0F6F1] text-center">
                <p className="text-[10px] text-[#7A8C78] font-semibold">
                  💡 Tip: Consult with an Ayurvedic practitioner before using medicinal plants
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Discovery Modal Popup */}
      {achievement && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="bg-gradient-to-br from-[#EAF2EC] to-[#D5EADF] border border-[#a8e063] shadow-2xl max-w-sm w-full rounded-3xl p-6 text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#a8e063]/10 rounded-full filter blur-xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-[#1D3D18] mx-auto flex items-center justify-center text-white text-3xl shadow-lg border border-[#a8e063]/30">
              🌿
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#1D3D18]">{achievement.plantName} Discovered!</h2>
              <p className="text-xs text-[#5C6E5A] font-medium">New medicinal herb added to your digital journal.</p>
            </div>

            <div className="flex justify-center gap-4 py-2">
              <div className="bg-white/80 border border-[#C5DCD0] px-4 py-2.5 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-[#7A8C78] font-bold uppercase">XP Reward</span>
                <span className="text-lg font-black text-[#1D3D18] mt-0.5">+{achievement.xp} XP</span>
              </div>
              <div className="bg-white/80 border border-[#C5DCD0] px-4 py-2.5 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-[#7A8C78] font-bold uppercase">Points Gained</span>
                <span className="text-lg font-black text-emerald-600 mt-0.5">+{achievement.pts} pts</span>
              </div>
            </div>

            <Button
              onClick={() => setAchievement(null)}
              className="w-full bg-[#1D3D18] hover:bg-[#2D6A4F] text-white font-bold rounded-2xl py-3 shadow-md"
            >
              Continue Exploring
            </Button>
          </Card>
        </div>
      )}

      {/* Daily Quiz Modal Popup */}
      {quizOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="bg-white border border-[#E1EDE4] shadow-2xl max-w-md w-full rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#1D3D18] text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#a8e063]" />
                <span className="font-extrabold text-sm uppercase tracking-wider">Daily Herb Quiz</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuizOpen(false)}
                className="text-white hover:bg-white/10 p-1.5 h-auto rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-6 space-y-6">
              {!quizAnswered ? (
                <div className="space-y-4">
                  <div className="bg-[#F4F8F5] border border-[#E1EDE4] p-4 rounded-2xl text-xs font-bold leading-relaxed">
                    "Which active compound in Turmeric is responsible for its golden color and powerful anti-inflammatory benefits?"
                  </div>

                  <div className="space-y-2.5">
                    {["Allicin", "Curcumin", "Gingerol"].map((option) => (
                      <div
                        key={option}
                        onClick={() => setSelectedAnswer(option)}
                        className={`border p-3 rounded-2xl text-xs font-bold cursor-pointer transition-all flex items-center gap-3 ${
                          selectedAnswer === option
                            ? "bg-[#EAF2EC] border-[#2D6A4F] text-[#1D3D18]"
                            : "bg-white border-[#E1EDE4] hover:bg-[#F4F8F5] text-[#5C6E5A]"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedAnswer === option ? "border-[#2D6A4F] bg-[#2D6A4F]" : "border-[#C5DCD0]"
                        }`}>
                          {selectedAnswer === option && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="w-full bg-[#1D3D18] hover:bg-[#2D6A4F] text-white font-bold rounded-2xl py-3 mt-4"
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-5 py-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF2EC] text-[#2D6A4F] mx-auto flex items-center justify-center text-3xl border border-[#C5DCD0]">
                    {quizCorrect ? "🎉" : "❌"}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-[#1D3D18]">
                      {quizCorrect ? "Quiz Completed Successfully!" : "Try Again Tomorrow"}
                    </h3>
                    <p className="text-xs text-[#5C6E5A] font-medium">
                      {quizCorrect 
                        ? "Great job! You answered Curcumin. Check back tomorrow for a new herb quiz!" 
                        : "Better luck next time! The correct answer was Curcumin."}
                    </p>
                  </div>

                  <Button
                    onClick={() => setQuizOpen(false)}
                    className="w-full bg-[#1D3D18] hover:bg-[#2D6A4F] text-white font-bold rounded-2xl py-3"
                  >
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="bg-white rounded-3xl shadow-2xl w-80 h-96 flex flex-col border border-[#E1EDE4] overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#1D3D18] to-[#2D6A4F] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-[#a8e063]" />
                </div>
                <div>
                  <span className="font-extrabold text-xs tracking-wide uppercase">AYUSH Expert</span>
                  <div className="text-[10px] opacity-90">Ask anything about herbs</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white/10 p-1.5 h-auto rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#F4F8F5]">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.type === "user"
                        ? "bg-[#1D3D18] text-white rounded-br-none"
                        : "bg-white border border-[#E1EDE4] text-[#1D3D18] rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-[#E1EDE4] bg-white">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Ask about medicinal plants..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-[#F4F8F5] border-[#E1EDE4] text-xs h-9 rounded-xl focus:ring-[#2D6A4F]"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-[#1D3D18] hover:bg-[#2D6A4F] px-3.5 h-9 rounded-xl"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-[#1D3D18] to-[#2D6A4F] hover:from-[#2D6A4F] hover:to-[#1D3D18] text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2.5 transition-all duration-200 hover:scale-105 border border-[#a8e063]/30"
          >
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-[#a8e063]" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-[10px] uppercase tracking-wide leading-none">AYUSH Expert</div>
              <div className="text-[9px] opacity-80 mt-0.5 leading-none">Chat online</div>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default VirtualGarden;