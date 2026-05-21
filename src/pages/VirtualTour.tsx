import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { plants } from "@/data/plants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Leaf, Lock, Compass, Trophy, BookOpen, Bell, 
  MessageSquare, Send, X, 
  ChevronRight, Sparkles, AlertCircle, Eye, 
  Book, CheckCircle2, RotateCcw, Trash2
} from "lucide-react";
import GlobalNavigation from "@/components/GlobalNavigation";
import { toast } from "sonner";

interface TourPlant {
  id: number;
  name: string;
  scientificName: string;
  category: "Immunity" | "Skin Care" | "Stress Relief" | "Rare Ayurvedic" | "Kitchen Herbs";
  description: string;
  benefits: string[];
  ayurvedicCategory: string;
  image: string;
  unlockedAtXp: number;
  angle: number; // Angle around the 3D cylinder
  yOffset: number; // Vertical offset
}

const tourPlants: TourPlant[] = [
  {
    id: 5,
    name: "Tulsi",
    scientificName: "Ocimum tenuiflorum",
    category: "Immunity",
    description: "Sacred basil that is a powerhouse of antioxidants and respiratory support.",
    benefits: ["Boosts immune system", "Reduces physical and mental stress", "Helps clear congestion"],
    ayurvedicCategory: "Rasayana (Rejuvenator)",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600",
    unlockedAtXp: 0,
    angle: 0,
    yOffset: 20,
  },
  {
    id: 8,
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    category: "Skin Care",
    description: "Succulent leaf filled with cooling gel that promotes cellular regeneration.",
    benefits: ["Hydrates and heals skin tissues", "Soothes burns and irritation", "Supports digestional health"],
    ayurvedicCategory: "Vranaropana (Wound healer)",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=600",
    unlockedAtXp: 0,
    angle: 52,
    yOffset: -10,
  },
  {
    id: 4,
    name: "Neem",
    scientificName: "Azadirachta indica",
    category: "Skin Care",
    description: "Known as nature's antiseptic, it clears toxins from blood and purifies skin.",
    benefits: ["Antibacterial and anti-fungal properties", "Purifies blood streams", "Regulates sebum and prevents breakouts"],
    ayurvedicCategory: "Kushtagna (Skin cleanser)",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600",
    unlockedAtXp: 0,
    angle: 85,
    yOffset: 30,
  },
  {
    id: 7,
    name: "Mint",
    scientificName: "Mentha",
    category: "Skin Care",
    description: "Refreshing herb used to cool skin and stimulate digestion.",
    benefits: ["Soothes acne and irritation", "Cooling and refreshing effect", "Aids digestion and freshens breath"],
    ayurvedicCategory: "Dipana (Digestive stimulant)",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=600",
    unlockedAtXp: 0,
    angle: 110,
    yOffset: -50,
  },
  {
    id: 1,
    name: "Giloy",
    scientificName: "Tinospora cordifolia",
    category: "Immunity",
    description: "Known as 'Amrita' or the root of immortality, it builds powerful defense.",
    benefits: ["Rich in antioxidants", "Treats chronic fever and infections", "Detoxifies kidneys and liver"],
    ayurvedicCategory: "Jwarahara (Fever healer)",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600",
    unlockedAtXp: 100,
    angle: 330,
    yOffset: -40,
  },
  {
    id: 2,
    name: "Amla",
    scientificName: "Phyllanthus emblica",
    category: "Immunity",
    description: "A superfood high in natural Vitamin C that enhances vitality.",
    benefits: ["Potent immunomodulator", "Improves skin health & hair strength", "Regulates digestive juices"],
    ayurvedicCategory: "Vayasthapana (Anti-aging)",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=600",
    unlockedAtXp: 100,
    angle: 25,
    yOffset: 35,
  },
  {
    id: 3,
    name: "Turmeric",
    scientificName: "Curcuma longa",
    category: "Skin Care",
    description: "Golden healing spice carrying curcumin, a strong anti-inflammatory compound.",
    benefits: ["Enhances skin complexion & glow", "Reduces internal inflammation", "Promotes joint lubrication and comfort"],
    ayurvedicCategory: "Lekhaniya (Detoxifier)",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600",
    unlockedAtXp: 100,
    angle: 65,
    yOffset: -30,
  },
  {
    id: 6,
    name: "Moringa",
    scientificName: "Moringa oleifera",
    category: "Immunity",
    description: "The miracle tree packed with vitamins, amino acids, and minerals.",
    benefits: ["Fights free radicals", "Reduces swelling and inflammation", "Boosts overall energy levels"],
    ayurvedicCategory: "Shothahara (Anti-inflammatory)",
    image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=600",
    unlockedAtXp: 250,
    angle: 345,
    yOffset: -80,
  },
  {
    id: 9,
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    category: "Stress Relief",
    description: "Adaptogenic root that strengthens the nervous system and calms the mind.",
    benefits: ["Reduces cortisol and anxiety", "Improves sleep and memory retention", "Enhances physical strength"],
    ayurvedicCategory: "Balya (Strength provider)",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600",
    unlockedAtXp: 250,
    angle: 145,
    yOffset: -10,
  },
  {
    id: 10,
    name: "Brahmi",
    scientificName: "Bacopa monnieri",
    category: "Stress Relief",
    description: "Traditional nerve tonic that sharpens memory and relieves anxiety.",
    benefits: ["Sharpen focus and cognitive abilities", "Reduces stress hormones", "Calms brain hyperactivity"],
    ayurvedicCategory: "Medhya (Brain tonic)",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=600",
    unlockedAtXp: 250,
    angle: 175,
    yOffset: 40,
  },
  {
    id: 11,
    name: "Shatavari",
    scientificName: "Asparagus racemosus",
    category: "Rare Ayurvedic",
    description: "Nourishing wild root valued for building hormonal balance and vigor.",
    benefits: ["Promotes female hormonal balance", "Supports nursing mothers", "Boosts cellular defense against stress"],
    ayurvedicCategory: "Rasayana (Vitalizer)",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600",
    unlockedAtXp: 450,
    angle: 220,
    yOffset: 0,
  },
  {
    id: 12,
    name: "Holy Basil",
    scientificName: "Ocimum sanctum",
    category: "Kitchen Herbs",
    description: "Venerated kitchen herb used to purify the home and respiratory paths.",
    benefits: ["Prevents skin and throat infections", "Improves oxygen intake and lungs", "Fights airborne pathogens"],
    ayurvedicCategory: "Kushtagna (Purifier)",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600",
    unlockedAtXp: 450,
    angle: 290,
    yOffset: -20,
  }
];

const bookLinks: Record<string, { name: string; link: string }> = {
  Giloy: { name: "Medicinal Plants of India", link: "https://books.google.com/" },
  Amla: { name: "Ayurvedic Healing", link: "https://books.google.com/" },
  Turmeric: { name: "Healing Spices", link: "https://books.google.com/" },
  Neem: { name: "Neem: Nature’s Healing Gift", link: "https://books.google.com/" },
  Tulsi: { name: "Holy Basil Guide", link: "https://books.google.com/" },
  Mint: { name: "Herbal Remedies Handbook", link: "https://books.google.com/" },
  "Aloe Vera": { name: "Aloe Vera Healing", link: "https://books.google.com/" },
  Brahmi: { name: "Ayurveda and Brain Health", link: "https://books.google.com/" },
  Ashwagandha: { name: "Adaptogenic Herbs", link: "https://books.google.com/" },
  Moringa: { name: "The Miracle Tree", link: "https://books.google.com/" },
  "Holy Basil": { name: "Holy Basil Medicinal Guide", link: "https://books.google.com/" },
};

const zones = [
  { name: "Immunity Herbs", id: "immunity", centerAngle: 0, icon: "🛡️" },
  { name: "Skin Care Plants", id: "skincare", centerAngle: 72, icon: "✨" },
  { name: "Stress Relief Herbs", id: "stress", centerAngle: 144, icon: "🧘" },
  { name: "Rare Ayurvedic Plants", id: "rare", centerAngle: 216, icon: "🌱" },
  { name: "Kitchen Medicinal Herbs", id: "kitchen", centerAngle: 288, icon: "🍳" }
];

const VirtualTour = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();

  // Cinematic Entry state
  const [hasEntered, setHasEntered] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  // 3D Cylinder rotation states
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const rotationStart = useRef(0);
  const velocity = useRef(0);
  const lastTime = useRef(0);
  const lastX = useRef(0);

  // Plant state
  const [selectedPlant, setSelectedPlant] = useState<TourPlant | null>(null);

  // Reminders state
  const [reminder, setReminder] = useState("");
  const [time, setTime] = useState("");
  const [savedReminders, setSavedReminders] = useState<any[]>([]);

  // Gamification states
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem("ayurvista_journey_xp");
    return saved ? Number(saved) : 0;
  });
  const [exploredPlantIds, setExploredPlantIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("ayurvista_explored_plants");
    return saved ? JSON.parse(saved) : [];
  });
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [previousLevelName, setPreviousLevelName] = useState("");
  const [earnedBadgeName, setEarnedBadgeName] = useState<string | null>(null);

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { type: "bot", message: "Greetings traveler of the garden! Ask me any questions regarding the plants you discover." }
  ]);

  // Load reminders for currently selected plant
  useEffect(() => {
    if (selectedPlant) {
      const stored = JSON.parse(localStorage.getItem("herbal_reminders") || "[]");
      setSavedReminders(stored.filter((item: any) => item.plantId === selectedPlant.id));
    } else {
      setSavedReminders([]);
    }
  }, [selectedPlant]);

  // URL Deep Link handler
  useEffect(() => {
    if (plantId) {
      setHasEntered(true);
      const targetPlant = tourPlants.find((p) => p.id === Number(plantId));
      if (targetPlant) {
        setRotationY(-targetPlant.angle);
        setSelectedPlant(targetPlant);
      }
    }
  }, [plantId]);

  // Ask notification permissions
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Global background check for scheduled reminders
  useEffect(() => {
    const checkReminders = () => {
      const stored = JSON.parse(localStorage.getItem("herbal_reminders") || "[]");
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      stored.forEach((item: any) => {
        const notifiedKey = `notified-${item.plantId}-${item.reminder}-${item.time}-${now.toDateString()}`;
        if (item.time === currentTime && !localStorage.getItem(notifiedKey)) {
          if (Notification.permission === "granted") {
            new Notification("🌿 Ayurvista Reminder", {
              body: `Intake reminder: ${item.reminder} (${item.plantName})`,
              icon: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=200",
            });
            localStorage.setItem(notifiedKey, "true");
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Gamification calculations
  const getLevelInfo = (currentXp: number) => {
    if (currentXp >= 600) return { title: "✨ Ayurveda Expert", rank: 4, nextXp: 1000, progress: 100 };
    if (currentXp >= 350) return { title: "🌿 Herbal Researcher", rank: 3, nextXp: 600, progress: ((currentXp - 350) / 250) * 100 };
    if (currentXp >= 150) return { title: "🍃 Plant Explorer", rank: 2, nextXp: 350, progress: ((currentXp - 150) / 200) * 100 };
    return { title: "🌱 Beginner Herbalist", rank: 1, nextXp: 150, progress: (currentXp / 150) * 100 };
  };

  const levelInfo = getLevelInfo(xp);

  const checkBadgeUnlocks = (currentExplored: number[]) => {
    const newlyUnlocked: string[] = [];
    const prevExploredCount = currentExplored.length - 1;

    if (currentExplored.length === 1 && prevExploredCount === 0) {
      newlyUnlocked.push("🌱 First Leaf Badge");
    }

    const immunityIds = [5, 1, 2, 6];
    const prevImmCount = exploredPlantIds.filter(id => immunityIds.includes(id)).length;
    const currentImmCount = currentExplored.filter(id => immunityIds.includes(id)).length;
    if (currentImmCount === 3 && prevImmCount < 3) {
      newlyUnlocked.push("🛡️ Immunity Guard Badge");
    }

    const skincareIds = [8, 4, 3, 7];
    const prevSkinCount = exploredPlantIds.filter(id => skincareIds.includes(id)).length;
    const currentSkinCount = currentExplored.filter(id => skincareIds.includes(id)).length;
    if (currentSkinCount === 3 && prevSkinCount < 3) {
      newlyUnlocked.push("✨ Skincare Sage Badge");
    }

    if (currentExplored.length === 12 && prevExploredCount < 12) {
      newlyUnlocked.push("👑 Ayurveda Master Badge");
    }

    if (newlyUnlocked.length > 0) {
      setEarnedBadgeName(newlyUnlocked[0]);
      toast.success(`Achievement Unlocked: ${newlyUnlocked[0]}!`);
    }
  };

  const badges = [
    { id: "first_leaf", name: "First Leaf", icon: "🌱", desc: "Explored 1 plant", unlocked: exploredPlantIds.length >= 1 },
    { 
      id: "immunity_guard", 
      name: "Immunity Guard", 
      icon: "🛡️", 
      desc: `Explored 3 immunity herbs (${exploredPlantIds.filter(id => [5,1,2,6].includes(id)).length}/3)`, 
      unlocked: exploredPlantIds.filter(id => [5,1,2,6].includes(id)).length >= 3 
    },
    { 
      id: "skincare_sage", 
      name: "Skincare Sage", 
      icon: "✨", 
      desc: `Explored 3 skincare herbs (${exploredPlantIds.filter(id => [8,4,3,7].includes(id)).length}/3)`, 
      unlocked: exploredPlantIds.filter(id => [8,4,3,7].includes(id)).length >= 3 
    },
    { id: "master_alchemist", name: "Ayurvista Master", icon: "👑", desc: `Discovered all 12 herbs (${exploredPlantIds.length}/12)`, unlocked: exploredPlantIds.length >= 12 }
  ];

  const explorePlant = (plant: TourPlant) => {
    if (exploredPlantIds.includes(plant.id)) return;

    const newExplored = [...exploredPlantIds, plant.id];
    setExploredPlantIds(newExplored);
    localStorage.setItem("ayurvista_explored_plants", JSON.stringify(newExplored));

    const newXp = xp + 50;
    setXp(newXp);
    localStorage.setItem("ayurvista_journey_xp", String(newXp));

    toast.success(`+50 XP Gained by exploring ${plant.name}!`);

    // Check Level Up
    const prevLevel = getLevelInfo(xp).title;
    const nextLevel = getLevelInfo(newXp).title;
    if (prevLevel !== nextLevel) {
      setPreviousLevelName(prevLevel);
      setShowLevelUpModal(true);
    }

    // Check badges
    checkBadgeUnlocks(newExplored);
  };

  // Reminder Operations
  const saveReminder = async () => {
    if (!selectedPlant || !reminder || !time) return;

    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Please enable notification permissions in your browser settings.");
        return;
      }
    }

    const newReminder = {
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      reminder,
      time,
    };

    const stored = JSON.parse(localStorage.getItem("herbal_reminders") || "[]");
    const updated = [...stored, newReminder];
    localStorage.setItem("herbal_reminders", JSON.stringify(updated));

    setSavedReminders(updated.filter((item: any) => item.plantId === selectedPlant.id));

    if (Notification.permission === "granted") {
      new Notification("✅ Reminder Scheduled", {
        body: `${reminder} for ${selectedPlant.name} at ${time}`,
        icon: selectedPlant.image,
      });
    }

    setReminder("");
    setTime("");
    toast.success("Reminder scheduled!");
  };

  const deleteReminder = (indexToDelete: number) => {
    if (!selectedPlant) return;

    const stored = JSON.parse(localStorage.getItem("herbal_reminders") || "[]");
    const plantReminders = stored.filter((item: any) => item.plantId === selectedPlant.id);
    const reminderToDelete = plantReminders[indexToDelete];

    const updated = stored.filter((item: any) =>
      !(
        item.plantId === reminderToDelete.plantId &&
        item.reminder === reminderToDelete.reminder &&
        item.time === reminderToDelete.time
      )
    );

    localStorage.setItem("herbal_reminders", JSON.stringify(updated));
    setSavedReminders(updated.filter((item: any) => item.plantId === selectedPlant.id));
    toast.success("Reminder removed.");
  };

  // Reset all gamification progress (for testing)
  const resetProgress = () => {
    if (confirm("Reset your herbal journey level, XP and badges?")) {
      localStorage.removeItem("ayurvista_journey_xp");
      localStorage.removeItem("ayurvista_explored_plants");
      setXp(0);
      setExploredPlantIds([]);
      toast.info("Herbal journey progress reset.");
    }
  };

  // Mouse / Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const clientX = e.clientX;
    dragStart.current = clientX;
    rotationStart.current = rotationY;
    velocity.current = 0;
    lastTime.current = performance.now();
    lastX.current = clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const clientX = e.clientX;
    const deltaX = clientX - dragStart.current;
    
    // Drag rotation sensitivity
    const sensitivity = 0.25; 
    setRotationY(rotationStart.current + deltaX * sensitivity);

    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = ((clientX - lastX.current) / dt) * 12;
    }
    lastTime.current = now;
    lastX.current = clientX;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    requestAnimationFrame(applyInertia);
  };

  const applyInertia = () => {
    if (isDragging) return;
    if (Math.abs(velocity.current) < 0.05) return;
    setRotationY((prev) => {
      const next = prev + velocity.current;
      velocity.current *= 0.95; // Friction coefficient
      return next;
    });
    requestAnimationFrame(applyInertia);
  };

  // Compass heading Calculations
  const getNormalizedAngle = (r: number) => {
    let angle = (-r) % 360;
    if (angle < 0) angle += 360;
    return angle;
  };

  const getCurrentZone = (r: number) => {
    const angle = getNormalizedAngle(r);
    if (angle >= 36 && angle < 108) return zones[1]; // Skincare
    if (angle >= 108 && angle < 180) return zones[2]; // Stress
    if (angle >= 180 && angle < 252) return zones[3]; // Rare
    if (angle >= 252 && angle < 324) return zones[4]; // Kitchen
    return zones[0]; // Immunity
  };

  const activeZone = getCurrentZone(rotationY);

  // Chatbot operations
  const askAiAboutPlant = (plantName: string) => {
    const msg = `What are the therapeutic benefits of ${plantName} in classical Ayurveda?`;
    setIsChatOpen(true);
    setChatMessages((prev) => [...prev, { type: "user", message: msg }]);
    setChatMessage("");
    sendChatMessage(msg);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const msg = chatMessage;
      setChatMessages((prev) => [...prev, { type: "user", message: msg }]);
      setChatMessage("");
      sendChatMessage(msg);
    }
  };

  const sendChatMessage = async (msgText: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = data && data.reply ? data.reply : "Ayurveda expert chatbot is gathering knowledge. Please ask again.";
      setChatMessages((prev) => [...prev, { type: "bot", message: reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { type: "bot", message: "Apologies, I couldn't reach the AI garden database." }]);
    }
  };

  // Cinematic enter transition
  const handleBeginTour = () => {
    setIsZooming(true);
    setTimeout(() => {
      setHasEntered(true);
      setIsZooming(false);
    }, 1200);
  };

  const book = selectedPlant ? bookLinks[selectedPlant.name] : null;
  const isDragActive = isDragging || Math.abs(velocity.current) > 0.05;

  const transformStyle = {
    transform: `rotateY(${rotationY}deg)`,
    transition: isDragActive ? "none" : "transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  return (
    <div className="vt-wrapper select-none text-white min-h-screen overflow-hidden bg-gradient-to-b from-[#030704] via-[#081209] to-[#040804] relative">
      <GlobalNavigation />

      {/* Cinematic entry overlay */}
      {!hasEntered && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#040905] transition-all duration-1000 ${isZooming ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,224,99,0.06)_0%,transparent_70%)] pointer-events-none" />
          
          {/* Ambient elements */}
          <div className="absolute top-20 opacity-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />

          {/* Intro Card Box */}
          <div className="glass-panel-glow max-w-lg w-full rounded-[2.5rem] p-8 text-center border border-white/5 shadow-2xl space-y-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-[#a8e063]/10 border border-[#a8e063]/30 mx-auto flex items-center justify-center animate-bounce">
              <Leaf className="w-8 h-8 text-[#a8e063]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ayurvista Metaverse</h1>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Step inside an interactive 360° AI-powered botanical sanctuary. 
                Discover magical herbs, gain XP, earn badges, and schedule health reminders.
              </p>
            </div>

            <Button 
              onClick={handleBeginTour}
              className="w-full bg-[#122415] hover:bg-[#1a3821] text-white rounded-full py-6 font-bold shadow-lg border border-[#a8e063]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,224,99,0.25)] flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-[#a8e063]" />
              <span>Begin the Virtual Journey</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Tour Page Content */}
      {hasEntered && (
        <div className="absolute inset-0 flex flex-col justify-between pt-16 z-0">
          
          {/* Parallax Background cylinder */}
          <div 
            className="absolute inset-0 z-0 bg-no-repeat bg-cover pointer-events-none select-none"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000")',
              backgroundPosition: `${rotationY * 1.5}px center`,
              transition: isDragActive ? 'none' : 'background-position 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
              filter: 'brightness(0.12) contrast(1.15) saturate(0.6) blur(2px)',
              transform: 'scale(1.05)'
            }}
          />

          {/* Environmental Fireflies Floating Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#a8e063] blur-[1px] animate-pulse opacity-50" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#a8e063] blur-[1px] animate-pulse opacity-60" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-[#86efac] blur-[1px] animate-pulse opacity-45" style={{ animationDelay: '3s' }} />
            <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#a8e063] blur-[1px] animate-pulse opacity-55" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* TOP HUD ROW: Compass & Gamification dashboard */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 z-20 pointer-events-auto">
            
            {/* Left side: Gamification stats panel */}
            <div className="glass-panel border border-white/5 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-[#a8e063]/10 border border-[#a8e063]/30 flex items-center justify-center text-xl">
                🏆
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wide text-white">{levelInfo.title}</span>
                  <span className="text-[10px] text-zinc-400 font-bold border border-white/10 rounded-full px-2 py-0.5">LVL {levelInfo.rank}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 sm:w-40 bg-zinc-950/60 rounded-full h-2 overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-[#a8e063] transition-all duration-300" style={{ width: `${levelInfo.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-[#a8e063]">{xp} XP</span>
                </div>
              </div>
              <button 
                onClick={resetProgress}
                className="ml-2 p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                title="Reset Journey Progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Center Compass indicator */}
            <div className="glass-panel border border-white/5 rounded-full px-6 py-2.5 flex items-center gap-2 shadow-xl backdrop-blur-md">
              <Compass className="w-4 h-4 text-[#a8e063] animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Facing Zone:</span>
              <span className="text-xs font-black text-[#a8e063] uppercase tracking-wider">{activeZone.icon} {activeZone.name}</span>
            </div>

            {/* Right side: Badge showcases */}
            <div className="flex gap-2">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md border backdrop-blur-md relative group transition-transform hover:scale-110 cursor-help ${
                    badge.unlocked 
                      ? "bg-[#a8e063]/15 border-[#a8e063]/30" 
                      : "bg-zinc-950/40 border-white/5 filter grayscale opacity-40"
                  }`}
                >
                  <span>{badge.icon}</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 bg-black/90 text-[9px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 border border-white/10 w-28 text-center z-50">
                    <p className="text-white leading-none">{badge.name}</p>
                    <p className="text-zinc-400 mt-0.5 leading-none">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* MIDDLE: 360° cylindrical container and drag capture */}
          <div 
            className="flex-1 w-full relative flex items-center justify-center z-10 pointer-events-auto cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
              perspective: '1500px',
              overflow: 'visible'
            }}
          >
            {/* Inner Cylinder Container holding 3D coordinates */}
            <div 
              style={{
                position: 'relative',
                width: '0px',
                height: '0px',
                transformStyle: 'preserve-3d',
                ...transformStyle
              }}
            >
              {/* Plot plant cards at mathematical coordinates */}
              {tourPlants.map((plant) => {
                const isLocked = xp < plant.unlockedAtXp;
                const isExplored = exploredPlantIds.includes(plant.id);
                
                return (
                  <div
                    key={plant.name}
                    className="absolute"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `translate(-50%, -50%) rotateY(${plant.angle}deg) translateZ(500px) rotateY(${-plant.angle}deg) translateY(${plant.yOffset}px)`,
                      width: '200px',
                      height: '240px'
                    }}
                  >
                    {/* Glowing card panel */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isLocked) {
                          toast.error(`🔒 This herb is locked! Requires ${plant.unlockedAtXp} XP. Discover more plants to unlock.`);
                          return;
                        }
                        setSelectedPlant(plant);
                        explorePlant(plant);
                      }}
                      className={`w-full h-full rounded-3xl p-3 border transition-all duration-300 backdrop-blur-md flex flex-col justify-between cursor-pointer ${
                        selectedPlant?.id === plant.id
                          ? "bg-[#a8e063]/15 border-[#a8e063] shadow-[0_0_25px_rgba(168,224,99,0.3)] scale-105"
                          : isLocked
                            ? "bg-zinc-950/60 border-white/5 filter saturate-50 opacity-80"
                            : "bg-[#0b170c]/55 border-white/10 hover:border-[#a8e063]/50 hover:shadow-[0_0_15px_rgba(168,224,99,0.15)] hover:scale-[1.02]"
                      }`}
                    >
                      {/* Visual top content */}
                      <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-zinc-950/40 border border-white/5">
                        <img 
                          src={plant.image} 
                          alt={plant.name}
                          className="w-full h-full object-cover" 
                        />
                        {isLocked ? (
                          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-1.5">
                            <Lock className="w-5 h-5 text-red-400" />
                            <span className="text-[9px] font-bold bg-red-950/60 border border-red-500/30 text-red-300 rounded-full px-2 py-0.5">{plant.unlockedAtXp} XP</span>
                          </div>
                        ) : (
                          <div className="absolute top-2 right-2">
                            <span className="text-[8px] font-bold bg-emerald-950/70 border border-emerald-500/20 text-[#a8e063] rounded-full px-2 py-0.5 uppercase tracking-wider">{plant.category}</span>
                          </div>
                        )}
                        
                        {/* Exploratory Status Tag */}
                        {!isLocked && (
                          <div className="absolute bottom-2 left-2">
                            {isExplored ? (
                              <span className="flex items-center gap-1 text-[8px] font-bold bg-zinc-900/80 border border-white/10 text-zinc-300 rounded-full px-2 py-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                <span>Explored</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[8px] font-bold bg-[#a8e063]/25 border border-[#a8e063]/30 text-[#a8e063] rounded-full px-2 py-0.5 animate-pulse">
                                <Sparkles className="w-2.5 h-2.5 text-[#a8e063]" />
                                <span>NEW</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Header and subtitle */}
                      <div className="space-y-1 text-center py-2">
                        <h3 className="text-sm font-black tracking-wide text-white leading-tight">{plant.name}</h3>
                        <p className="text-[9px] text-[#a8e063] italic font-semibold leading-none">{plant.scientificName}</p>
                      </div>

                      {/* Interactive Pulse dot */}
                      <div className="flex items-center justify-center pb-1">
                        {isLocked ? (
                          <span className="text-[9px] font-bold text-zinc-500">Locked</span>
                        ) : (
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8e063] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#a8e063]"></span>
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM SECTION: guide, nature sound controls, zone click triggers */}
          <div className="w-full z-20 pointer-events-auto">
            
            {/* Guide */}
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center pb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse">↔ Drag viewport to orbit the garden</span>
            </div>

            {/* Zone triggers bottom bar */}
            <div className="w-full bg-[#050a06]/85 border-t border-white/5 py-4 backdrop-blur-md">
              <div className="max-w-4xl mx-auto px-4 grid grid-cols-5 gap-2 sm:gap-4">
                {zones.map((zone) => {
                  const isCurrent = activeZone.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        // Click to center this zone. Center is at zone.centerAngle. 
                        // To display it centered, set rotationY = -zone.centerAngle
                        setRotationY(-zone.centerAngle);
                      }}
                      className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-300 ${
                        isCurrent 
                          ? "bg-[#a8e063]/15 border border-[#a8e063]/30 scale-105" 
                          : "glass-panel border border-white/5 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <span className="text-base sm:text-lg mb-1">{zone.icon}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider truncate max-w-full ${
                        isCurrent ? "text-[#a8e063]" : "text-zinc-400"
                      }`}>
                        {zone.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Immersive Discovery Sheet Slide-In Panel */}
          {selectedPlant && (
            <div className="absolute right-0 top-16 bottom-0 w-80 sm:w-[420px] bg-[#060b06]/95 border-l border-white/10 z-40 flex flex-col shadow-2xl backdrop-blur-2xl animate-fade-in pointer-events-auto">
              
              {/* Header Image cover */}
              <div className="relative w-full h-44 border-b border-white/5 bg-zinc-950">
                <img 
                  src={selectedPlant.image} 
                  alt={selectedPlant.name}
                  className="w-full h-full object-cover" 
                />
                <button
                  onClick={() => setSelectedPlant(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="text-[10px] font-bold bg-[#a8e063]/20 border border-[#a8e063]/40 text-[#a8e063] rounded-full px-3 py-1 uppercase tracking-wider backdrop-blur-sm">{selectedPlant.category}</span>
                  <span className="text-[10px] font-bold bg-white/10 border border-white/20 text-white rounded-full px-3 py-1 uppercase tracking-wider backdrop-blur-sm">{selectedPlant.ayurvedicCategory}</span>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-black text-white leading-none">{selectedPlant.name}</h2>
                  <p className="text-xs text-[#a8e063] italic font-semibold mt-1">{selectedPlant.scientificName}</p>
                  <p className="text-zinc-300 text-xs leading-relaxed mt-3 font-medium">{selectedPlant.description}</p>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#a8e063] flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Therapeutic Benefits</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedPlant.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2.5 p-2.5 bg-white/5 border border-white/5 rounded-xl text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#a8e063]" />
                        <span className="text-zinc-300 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REMINDER SCHEDULER SECTION (Pre-existing functionality integrated) */}
                <div className="p-4 rounded-2xl bg-[#09150a] border border-[#a8e063]/15 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#a8e063]" />
                    <span>Intake Scheduler</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="e.g. Consume powder, Tea extraction"
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value)}
                      className="bg-white/5 border-white/10 text-xs h-9 text-white focus-visible:ring-[#a8e063] rounded-xl"
                    />
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-white/5 border-white/10 text-xs h-9 text-white focus-visible:ring-[#a8e063] rounded-xl"
                    />
                    <Button
                      onClick={saveReminder}
                      className="w-full bg-[#142d17] hover:bg-[#1f4725] text-[#a8e063] border border-[#a8e063]/30 font-bold text-xs h-9 rounded-xl transition-all"
                    >
                      Save Schedule Reminder
                    </Button>
                  </div>

                  {/* Scheduled items */}
                  {savedReminders.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Scheduled Active Reminders:</h4>
                      <div className="space-y-2">
                        {savedReminders.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs">
                            <div className="space-y-0.5">
                              <p className="font-bold text-white">🌿 {item.reminder}</p>
                              <p className="text-[9px] text-[#a8e063] font-medium">⏰ Intake time: {item.time}</p>
                            </div>
                            <button 
                              onClick={() => deleteReminder(index)}
                              className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta actions: Ask AI, books, bookmarks */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={() => askAiAboutPlant(selectedPlant.name)}
                    className="w-full bg-[#122415] hover:bg-[#1a3821] text-white border border-[#a8e063]/20 font-bold text-xs py-5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#a8e063]" />
                    <span>Ask AI Expert About This Plant</span>
                  </Button>

                  {book && (
                    <Button
                      variant="outline"
                      className="w-full border-white/10 hover:bg-white/5 text-zinc-300 font-bold text-xs py-5 rounded-xl flex items-center justify-center gap-2"
                      onClick={() => window.open(book.link, "_blank")}
                    >
                      <Book className="w-4 h-4" />
                      <span>📚 Read: {book.name}</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full text-zinc-500 hover:text-zinc-300 text-[10px] font-black uppercase tracking-wider"
                    onClick={() => navigate("/bookmarks")}
                  >
                    ← Back to Bookmarks
                  </Button>
                </div>

              </div>

            </div>
          )}

          {/* LEVEL UP POPUP OVERLAY */}
          {showLevelUpModal && (
            <div className="fixed inset-0 z-[110] bg-black/85 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in pointer-events-auto">
              <div className="glass-panel-glow max-w-sm w-full rounded-[2.5rem] p-8 border border-[#a8e063]/30 text-center shadow-2xl space-y-6 relative">
                <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#a8e063] flex items-center justify-center text-3xl shadow-lg border-4 border-[#030704] animate-bounce">
                  🎉
                </div>
                <div className="space-y-2 pt-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a8e063]">Rank Promoted</span>
                  <h2 className="text-2xl font-black text-white">Level Up!</h2>
                  <p className="text-zinc-400 text-xs font-semibold">
                    You have leveled up from <span className="text-zinc-300">{previousLevelName}</span> to <span className="text-[#a8e063] font-bold">{levelInfo.title}</span>!
                  </p>
                </div>

                <div className="bg-[#a8e063]/10 border border-[#a8e063]/25 rounded-2xl p-4 flex items-center justify-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <div className="text-left">
                    <span className="block text-[8px] font-bold text-zinc-400 uppercase tracking-widest">New Rank unlocked</span>
                    <span className="text-xs font-extrabold text-white">Ayurveda Tier Level {levelInfo.rank}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowLevelUpModal(false)}
                  className="w-full bg-[#122415] hover:bg-[#1a3821] text-white rounded-full py-5 font-bold shadow-md border border-[#a8e063]/20"
                >
                  Continue Journey
                </Button>
              </div>
            </div>
          )}

          {/* CHATBOT INTEGRATED WIDGET DRAWER */}
          <div className="fixed bottom-20 right-6 z-50 pointer-events-auto">
            {isChatOpen && (
              <div className="glass-card-dark border border-[#a8e063]/20 rounded-2xl w-80 sm:w-96 h-[440px] flex flex-col shadow-2xl backdrop-blur-2xl animate-fade-in">
                
                {/* Chat Header */}
                <div className="p-4 rounded-t-2xl flex items-center justify-between border-b border-white/5 bg-[#0e1f10]/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#a8e063]/25 flex items-center justify-center border border-[#a8e063]/40">
                      <Leaf className="h-4 w-4 text-[#a8e063]" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white tracking-wide">AYUSH Chatbot Expert</span>
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

                {/* Chat messages list */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-hide bg-zinc-950/20">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.type === "user"
                            ? "bg-[#142d17] text-white border border-[#a8e063]/20 rounded-tr-none shadow-sm"
                            : "glass-panel text-zinc-200 border border-white/5 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input container */}
                <div className="p-4 border-t border-white/5 bg-[#0a150c]/80">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Ask herbal expert..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-white/5 border-white/10 text-white rounded-full text-xs h-10 px-4 focus-visible:ring-1 focus-visible:ring-[#a8e063]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="text-white rounded-full w-10 h-10 flex items-center justify-center p-0 shadow-md border border-[#a8e063]/20 transition-all hover:scale-105"
                      style={{ backgroundColor: '#142d17' }}
                    >
                      <Send className="h-4 w-4 text-[#a8e063]" />
                    </Button>
                  </div>
                </div>

              </div>
            )}

            {/* Small floating chat trigger badge when drawer is closed */}
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-12 h-12 rounded-full bg-[#122415] hover:bg-[#1a3821] border border-[#a8e063]/30 hover:scale-115 hover:shadow-[0_0_15px_rgba(168,224,99,0.25)] flex items-center justify-center text-[#a8e063] transition-all shadow-xl"
                title="Ask AI Bot"
              >
                <MessageSquare className="w-5 h-5 text-[#a8e063]" />
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default VirtualTour;