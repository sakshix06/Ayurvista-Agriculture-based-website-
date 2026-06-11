import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import { plantsExtended, PlantExtended } from "@/data/plantsExtended";
import { isBookmarked, toggleBookmark } from "@/utils/bookmarks";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Bookmark,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Check,
  ChevronDown,
  X,
  Loader2,
  Bot,
  Send,
  HelpCircle,
  Activity
} from "lucide-react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}

const Explore = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("Adult");
  const [selectedGoal, setSelectedGoal] = useState("Immunity Boost");
  const [activeChip, setActiveChip] = useState("View All");

  // Display state
  const [filteredHerbs, setFilteredHerbs] = useState<PlantExtended[]>([]);
  const [resultsTitle, setResultsTitle] = useState("All Herbs");
  const [isAiFiltered, setIsAiFiltered] = useState(false);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [aiInsight, setAiInsight] = useState("");

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Modal State
  const [selectedPlant, setSelectedPlant] = useState<PlantExtended | null>(null);
  const [modalType, setModalType] = useState<"benefits" | "uses" | "ai" | null>(null);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatLoading]);

  // Initialize bookmarks
  useEffect(() => {
    setBookmarks(JSON.parse(localStorage.getItem("herbal_bookmarks") || "[]"));
  }, []);

  const handleBookmark = (plantId: number) => {
    toggleBookmark(plantId);
    setBookmarks(JSON.parse(localStorage.getItem("herbal_bookmarks") || "[]"));
    const bookmarked = JSON.parse(localStorage.getItem("herbal_bookmarks") || "[]").includes(plantId);
    toast.success(bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
  };

  // Symptoms list
  const symptomsList = [
    { value: "cough-cold", label: lang === "en" ? "Cold & Cough" : "सर्दी और खांसी" },
    { value: "hair-fall", label: lang === "en" ? "Hair Fall & Thinning" : "बालों का झड़ना" },
    { value: "acne", label: lang === "en" ? "Acne & Skin Blemishes" : "मुँहासे और त्वचा विकार" },
    { value: "indigestion", label: lang === "en" ? "Indigestion & Bloating" : "अपच और पेट फूलना" },
    { value: "stress", label: lang === "en" ? "Stress & Anxiety" : "तनाव और चिंता" },
    { value: "fatigue", label: lang === "en" ? "Fatigue & Low Energy" : "थकान और कम ऊर्जा" },
    { value: "toxins", label: lang === "en" ? "Toxins & Body Heat" : "विषाक्त पदार्थ और गर्मी" }
  ];

  // Goals list
  const goalsList = [
    { value: "Immunity Boost", label: lang === "en" ? "Immunity Boost" : "प्रतिरक्षा बूस्ट" },
    { value: "Better Digestion", label: lang === "en" ? "Better Digestion" : "बेहतर पाचन" },
    { value: "Hair Growth", label: lang === "en" ? "Hair Growth" : "बालों का विकास" },
    { value: "Skin Care", label: lang === "en" ? "Skin Care" : "त्वचा की देखभाल" },
    { value: "Stress Relief", label: lang === "en" ? "Stress Relief" : "तनाव से राहत" },
    { value: "Detox", label: lang === "en" ? "Detox" : "डिटॉक्स" }
  ];

  // Quick Filter chips matching user's spec
  const quickFilters = ["Immunity", "Hair Fall", "Skin Care", "Digestion", "Stress Relief", "Detox", "View All"];

  // Central fetch logic
  const fetchHerbs = async (
    pageNumber: number,
    append: boolean = false,
    currentQuery?: string,
    currentChip?: string,
    currentSymptom?: string,
    currentGoal?: string
  ) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const q = currentQuery !== undefined ? currentQuery : searchQuery;
      const ch = currentChip !== undefined ? currentChip : activeChip;
      const sym = currentSymptom !== undefined ? currentSymptom : selectedSymptom;
      const gl = currentGoal !== undefined ? currentGoal : selectedGoal;

      const params = new URLSearchParams();
      params.append("page", pageNumber.toString());
      params.append("limit", "4");

      if (q.trim()) {
        params.append("query", q.trim());
      } else if (ch && ch !== "View All") {
        params.append("chip", ch);
      } else if (sym || gl) {
        if (sym) params.append("symptom", sym);
        if (gl) params.append("goal", gl);
        if (selectedAgeGroup) params.append("ageGroup", selectedAgeGroup);
      }

      const res = await fetch(`/api/plants/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();

      if (append) {
        setFilteredHerbs((prev) => [...prev, ...data.plants]);
      } else {
        setFilteredHerbs(data.plants);
      }

      setTotalResults(data.total || 0);
      setHasMore(data.hasMore || false);
      setPage(data.page || pageNumber);
      setAiInsight(data.aiInsight || "");
      setNoMatchFound(data.isFallback || false);
    } catch (err) {
      console.error(err);
      toast.error(lang === 'en' ? "Failed to fetch herbs from database." : "डेटाबेस से जड़ी-बूटियाँ प्राप्त करने में विफल।");
    } finally {
      setIsLoading(false);
    }
  };

  // Search logic
  const executeSearch = (query: string) => {
    setNoMatchFound(false);
    setIsAiFiltered(false);
    setActiveChip("View All");
    setSelectedSymptom("");
    setSelectedGoal("Immunity Boost");

    if (!query.trim()) {
      setFilteredHerbs([]);
      setResultsTitle("All Herbs");
      setHasSearched(false);
      setPage(1);
      setHasMore(false);
      return;
    }

    setResultsTitle(lang === 'en' ? `Search results for: "${query}"` : `"${query}" के परिणाम:`);
    fetchHerbs(1, false, query, "View All", "", "");
  };

  // Chip Filter logic
  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    setSearchQuery("");
    setSelectedSymptom("");
    setSelectedGoal("Immunity Boost");
    setIsAiFiltered(false);
    setNoMatchFound(false);

    setResultsTitle(chip === "View All" ? (lang === 'en' ? "All Herbs" : "सभी जड़ी-बूटियाँ") : (lang === 'en' ? `Recommended Herbs for: ${chip}` : `अनुशंसित जड़ी-बूटियाँ: ${translateChip(chip)}`));
    fetchHerbs(1, false, "", chip, "", "");
  };

  // Remedy Finder Filter logic (Sidebar)
  const handleFindRemedy = () => {
    setSearchQuery("");
    setNoMatchFound(false);
    setIsAiFiltered(true);
    setActiveChip("View All");

    setResultsTitle(`${selectedGoal} (${selectedAgeGroup})`);
    fetchHerbs(1, false, "", "View All", selectedSymptom, selectedGoal);
    toast.success(lang === 'en' ? "AI Remedy Finder applied!" : "एआई उपचार खोजक लागू किया गया!");
  };

  // Reset Filters
  const handleReset = () => {
    setSearchQuery("");
    setSelectedSymptom("");
    setSelectedAgeGroup("Adult");
    setSelectedGoal("Immunity Boost");
    setActiveChip("View All");
    setFilteredHerbs([]);
    setResultsTitle("All Herbs");
    setIsAiFiltered(false);
    setNoMatchFound(false);
    setHasSearched(false);
    setPage(1);
    setHasMore(false);
    setAiInsight("");
    toast.success(lang === 'en' ? "Filters reset to default" : "फ़िल्टर रीसेट कर दिए गए हैं");
  };

  // Load More logic
  const handleLoadMore = () => {
    fetchHerbs(page + 1, true);
  };

  // Modal open
  const openModal = (plant: PlantExtended, type: "benefits" | "uses" | "ai") => {
    setSelectedPlant(plant);
    setModalType(type);

    if (type === "ai") {
      const welcome = lang === "en"
        ? `Hello! I am your AI Ayurvedic Assistant. Ask me anything about ${plant.name}.`
        : `नमस्ते! मैं आपका एआई आयुर्वेदिक सहायक हूँ। मुझसे ${plant.name} के बारे में कुछ भी पूछें।`;
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChatMessages([{ sender: "ai", text: welcome, timestamp: timeStr }]);
      setChatInput("");
    }
  };

  // AI Chat Q&A Submit
  const handleSendChatMessage = async (customText?: string) => {
    const textToSend = typeof customText === "string" ? customText : chatInput;
    if (!textToSend.trim() || !selectedPlant) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "user", text: textToSend, timestamp: timeStr }]);
    if (typeof customText !== "string") setChatInput("");
    setIsChatLoading(true);

    try {
      const historyForBackend = chatMessages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch("/api/ai/plant-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          history: historyForBackend,
          plantName: selectedPlant.name,
          scientificName: selectedPlant.scientificName,
          language: lang
        })
      });

      if (!response.ok) throw new Error("AI QA failed");
      const data = await response.json();
      const reply = data?.answer || data?.reply;

      if (reply) {
        const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setChatMessages((prev) => [...prev, { sender: "ai", text: reply, timestamp: replyTime }]);
      } else {
        throw new Error("No answer received");
      }
    } catch (err) {
      console.error("AI QA error:", err);
      let fallbackAnswer = "";
      const query = textToSend.toLowerCase();

      if (query.includes("benefit") || query.includes("good for") || query.includes("फायदे")) {
        fallbackAnswer = `${selectedPlant.name} is known for: ${selectedPlant.fullBenefits.join(", ")}.`;
      } else if (query.includes("how to use") || query.includes("dosage") || query.includes("उपयोग")) {
        fallbackAnswer = `Traditional uses for ${selectedPlant.name}: ${selectedPlant.detailedUses.join(" Or ")}`;
      } else if (query.includes("precaution") || query.includes("safe") || query.includes("सावधानी")) {
        fallbackAnswer = `Precautions for ${selectedPlant.name}: ${selectedPlant.precautions.join(" ")}`;
      } else {
        fallbackAnswer = `${selectedPlant.name} (${selectedPlant.scientificName}) is an excellent Ayurvedic herb. It belongs to the ${selectedPlant.category} category and is traditionally used to address symptoms like ${selectedPlant.symptoms.join(", ")}. Always consult an expert for detailed usage.`;
      }

      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { sender: "ai", text: fallbackAnswer, timestamp: replyTime }]);
      }, 600);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendSuggestion = (suggestionKey: string) => {
    if (!selectedPlant) return;
    
    let query = "";
    if (lang === "en") {
      switch (suggestionKey) {
        case "benefits":
          query = `What are the primary health benefits of ${selectedPlant.name}?`;
          break;
        case "uses":
          query = `How is ${selectedPlant.name} traditionally used and what is the recommended dosage?`;
          break;
        case "precautions":
          query = `What precautions or safety measures should I take with ${selectedPlant.name}?`;
          break;
        case "related":
          query = `What are some related herbs that complement ${selectedPlant.name}?`;
          break;
        case "ayur":
          query = `What is the Ayurvedic importance and dosha balancing properties of ${selectedPlant.name}?`;
          break;
        default:
          query = `Tell me more about ${selectedPlant.name}.`;
      }
    } else {
      switch (suggestionKey) {
        case "benefits":
          query = `${selectedPlant.name} के मुख्य स्वास्थ्य लाभ क्या हैं?`;
          break;
        case "uses":
          query = `${selectedPlant.name} का पारंपरिक रूप से कैसे उपयोग किया जाता है और अनुशंसित खुराक क्या है?`;
          break;
        case "precautions":
          query = `${selectedPlant.name} के साथ मुझे क्या सावधानियां या सुरक्षा उपाय बरतने चाहिए?`;
          break;
        case "related":
          query = `${selectedPlant.name} के साथ कौन सी अन्य जड़ी-बूटियां पूरक के रूप में काम करती हैं?`;
          break;
        case "ayur":
          query = `${selectedPlant.name} का आयुर्वेदिक महत्व और त्रिदोष संतुलन गुण क्या हैं?`;
          break;
        default:
          query = `${selectedPlant.name} के बारे में और जानकारी दें।`;
      }
    }
    
    handleSendChatMessage(query);
  };

  // Dynamic Ayurvedic Insight content based on goals & age group
  const getDynamicInsight = () => {
    const ageLabel = lang === "en" ? selectedAgeGroup : (
      selectedAgeGroup === "Child" ? "बच्चों" :
      selectedAgeGroup === "Teen" ? "किशोरों" :
      selectedAgeGroup === "Adult" ? "वयस्कों" : "वरिष्ठ नागरिकों"
    );

    let goalText = "";
    if (selectedGoal === "Immunity Boost") {
      goalText = lang === "en"
        ? `we recommend immunomodulator herbs (Rasayanas) like Giloy and Amla that support natural defense systems, fight fatigue, and revitalize body tissues.`
        : `हम गिलोय और आंवला जैसी रोग प्रतिरोधक क्षमता बढ़ाने वाली जड़ी-बूटियों (रसायनों) की सलाह देते हैं जो प्राकृतिक रक्षा प्रणालियों का समर्थन करती हैं, थकान से लड़ती हैं और शरीर के ऊतकों को पुनर्जीवित करती हैं।`;
    } else if (selectedGoal === "Better Digestion") {
      goalText = lang === "en"
        ? `cooling and carminative herbs like Mint and Aloe Vera help balance the digestive fire (Agni) and alleviate bloating and acidity.`
        : `पुदीना और एलोवेरा जैसी ठंडी और पाचक जड़ी-बूटियां पाचक अग्नि को संतुलित करने और पेट फूलने और एसिडिटी को कम करने में मदद करती हैं।`;
    } else if (selectedGoal === "Hair Growth") {
      goalText = lang === "en"
        ? `Amla and Brahmi nourish the scalp, strengthen roots, and promote healthy growth by balancing internal nutritional channels.`
        : `आंवला और ब्राह्मी आंतरिक पोषण चैनलों को संतुलित करके खोपड़ी को पोषण देते हैं, जड़ों को मजबूत करते हैं और स्वस्थ बालों के विकास को बढ़ावा देते हैं।`;
    } else if (selectedGoal === "Skin Care") {
      goalText = lang === "en"
        ? `bitter and blood-purifying herbs like Neem and Turmeric soothe skin irritation, clear blemishes, and detoxify skin from within.`
        : `नीम और हल्दी जैसी कड़वी और रक्त-शोधक जड़ी-बूटियां त्वचा की जलन को शांत करती हैं, दाग-धब्बों को साफ करती हैं और त्वचा को अंदर से डिटॉक्सिफाई करती हैं।`;
    } else if (selectedGoal === "Stress Relief") {
      goalText = lang === "en"
        ? `adaptogenic herbs (Medhya Rasayanas) like Ashwagandha and Brahmi calm the nervous system (Vata dosha) and improve sleep quality.`
        : `अश्वगंधा और ब्राह्मी जैसी एडाप्टोजेनिक जड़ी-बूटियां तंत्रिका तंत्र (वात दोष) को शांत करती हैं और नींद की गुणवत्ता में सुधार करती हैं।`;
    } else if (selectedGoal === "Detox") {
      goalText = lang === "en"
        ? `blood purifiers like Neem and Giloy help flush metabolic toxins (Ama) out of the liver, blood, and digestive tract.`
        : `नीम और गिलोय जैसे रक्त शोधक लीवर, रक्त और पाचन तंत्र से उपापचयी विषाक्त पदार्थों (आम) को बाहर निकालने में मदद करते हैं।`;
    }

    if (lang === "en") {
      return `To achieve ${selectedGoal} for ${ageLabel}s, ${goalText} Ayurveda focus on treating the root cause and balancing your primary doshas.`;
    } else {
      return `${ageLabel} के लिए ${selectedGoal} प्राप्त करने हेतु, ${goalText} आयुर्वेद हमेशा जड़ कारण का इलाज करने और आपके प्राथमिक दोषों को संतुलित करने पर केंद्रित है।`;
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-[#FAF9F5] text-zinc-900 font-sans">
      <GlobalNavigation />

      <div className="max-w-[94%] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,260px)_1fr] gap-6 items-start">
          
          {/* ========================================== */}
          {/* LEFT SIDEBAR: Remedy Finder Panel           */}
          {/* ========================================== */}
          <div className="bg-[#1A2417] text-white rounded-2xl p-5 shadow-xl border border-emerald-950/20">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="h-6 w-6 text-[#a8e063] animate-pulse" />
              <h2 className="text-xl font-bold tracking-tight">{lang === 'en' ? 'Find Your Remedy' : 'अपना उपचार खोजें'}</h2>
            </div>

            {/* Step 1: Select Symptom */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                {lang === 'en' ? '1. Select Symptom' : '1. लक्षण चुनें'}
              </label>
              <div className="relative">
                <select
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                  className="w-full bg-[#243521] border border-emerald-800/40 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none appearance-none cursor-pointer focus:border-[#a8e063] transition-colors"
                >
                  <option value="">{lang === 'en' ? 'Select symptom' : 'लक्षण चुनें'}</option>
                  {symptomsList.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
              </div>
            </div>

            {/* Step 2: Select Age Group */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2.5">
                {lang === 'en' ? '2. Select Age Group' : '2. आयु वर्ग चुनें'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Child", "Teen", "Adult", "Senior"].map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAgeGroup(age)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all duration-300 ${
                      selectedAgeGroup === age
                        ? "bg-white text-[#1A2417] border-white shadow-md"
                        : "bg-transparent text-emerald-200/70 border-emerald-800/30 hover:border-emerald-600/40 hover:text-white"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Select Goal */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2.5">
                {lang === 'en' ? '3. Select Goal' : '3. स्वास्थ्य लक्ष्य चुनें'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalsList.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setSelectedGoal(g.value)}
                    className={`py-2.5 px-2 text-[11px] font-semibold rounded-xl border leading-tight transition-all duration-300 ${
                      selectedGoal === g.value
                        ? "bg-[#a8e063]/20 text-[#a8e063] border-[#a8e063] shadow-inner"
                        : "bg-transparent text-emerald-200/70 border-emerald-800/30 hover:border-emerald-600/40 hover:text-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Find Button */}
            <button
              onClick={handleFindRemedy}
              className="w-full bg-[#a8e063] hover:bg-[#92cc53] text-[#1A2417] font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-[#a8e063]/20 flex items-center justify-center gap-2 transition-all duration-300 hover:translate-y-[-1px]"
            >
              <span>{lang === 'en' ? 'Find My Remedy' : 'मेरा उपचार खोजें'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Shield Footer */}
            <div className="mt-6 pt-5 border-t border-emerald-800/20 flex items-start gap-2.5 text-[11px] text-emerald-200/60 leading-relaxed">
              <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 mt-0.5">
                <Check className="h-3 w-3" />
              </div>
              <p>
                {lang === 'en'
                  ? 'Our AI recommends herbs based on Ayurveda, backed by ancient wisdom.'
                  : 'हमारी एआई आयुर्वेद और प्राचीन ज्ञान पर आधारित जड़ी-बूटियों की सिफारिश करती है।'}
              </p>
            </div>
          </div>

          {/* ========================================== */}
          {/* MAIN CONTENT AREA: Hub & Cards            */}
          {/* ========================================== */}
          <div className="space-y-5">
            
            {/* HERBAL DISCOVERY HUB CARD */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-zinc-200/60">
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#a8e063]/10 flex items-center justify-center">
                  <LeafIcon className="h-6 w-6 text-[#1A2417]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2417] tracking-tight">
                    {lang === 'en' ? 'Herbal Discovery Hub' : 'हर्बल डिस्कवरी हब'}
                  </h1>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    {lang === 'en' 
                      ? 'Search, explore, and discover the best medicinal plants for your health.'
                      : 'अपने स्वास्थ्य के लिए सर्वोत्तम औषधीय पौधों की खोज, अन्वेषण और पहचान करें।'}
                  </p>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="flex gap-2 max-w-2xl mt-5">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'Search for herbs, symptoms, benefits, or goals...' : 'जड़ी-बूटियों, लक्षणों, लाभों या लक्ष्यों की खोज करें...'}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      executeSearch(e.target.value);
                    }}
                    className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-[#1A2417] focus:ring-1 focus:ring-[#1A2417] transition-all"
                  />
                </div>
                <button
                  onClick={() => executeSearch(searchQuery)}
                  className="bg-[#1A2417] hover:bg-[#2D3E29] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
                >
                  {lang === 'en' ? 'Search' : 'खोजें'}
                </button>
              </div>

              {/* QUICK FILTERS CHIPS */}
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2.5">
                  {lang === 'en' ? 'Quick Filters (Diseases / Concerns)' : 'त्वरित फ़िल्टर (रोग / चिंताएं)'}
                </span>
                <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {quickFilters.map((chip) => {
                    const isSelected = activeChip === chip;
                    return (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
                          isSelected
                            ? "bg-[#1A2417] text-white shadow-sm"
                            : "bg-[#FAF9F5] hover:bg-[#F0EFEA] text-zinc-700 border border-zinc-200"
                        }`}
                      >
                        {getChipIcon(chip)}
                        <span>{lang === 'en' ? chip : translateChip(chip)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RESULTS HEADER */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-1 border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-[#1A2417]">
                  {lang === 'en' ? 'Recommended Herbs For You' : 'आपके लिए अनुशंसित जड़ी-बूटियां'}
                </h3>
                {isAiFiltered && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3 fill-emerald-700" />
                    <span>AI Based</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-zinc-400">
                  {lang === 'en' ? 'Showing results for:' : 'इसके लिए परिणाम:'}{" "}
                  <strong className="text-zinc-700">{resultsTitle}</strong>
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-[#1A2417] hover:text-emerald-800 flex items-center gap-1 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{lang === 'en' ? 'Reset' : 'रीसेट'}</span>
                </button>
              </div>
            </div>

            {/* NO MATCH FOUND WARNING */}
            {noMatchFound && (
              <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4 flex gap-3 text-sm text-amber-800 leading-relaxed shadow-sm">
                <HelpCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block mb-0.5">
                    {lang === 'en' ? 'No exact match found.' : 'कोई सटीक परिणाम नहीं मिला।'}
                  </strong>
                  <span>
                    {lang === 'en'
                      ? "Based on Ayurvedic properties, we've suggested the closest relevant herbs for your wellness query below."
                      : "आयुर्वेदिक गुणों के आधार पर, हमने नीचे आपकी कल्याण संबंधी खोज के लिए सबसे करीबी प्रासंगिक जड़ी-बूटियों का सुझाव दिया है।"}
                  </span>
                </div>
              </div>
            )}

            {/* DYNAMIC CARDS CONTAINER */}
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-white rounded-2xl border border-zinc-200/60 shadow-sm min-h-[250px] animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#1A2417] mb-3">
                  <Search className="h-6 w-6 text-[#1A2417]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A2417] mb-1.5">
                  {lang === "en" ? "Begin Your Ayurvedic Journey" : "अपनी आयुर्वेदिक यात्रा शुरू करें"}
                </h3>
                <p className="text-zinc-500 max-w-md text-sm leading-relaxed mb-4">
                  {lang === "en"
                    ? "Enter a symptom, search by herb name, select a health goal, or apply a quick filter to discover medicinal herbs and receive AI-guided recommendations."
                    : "औषधीय जड़ी-बूटियों की खोज करने और एआई-निर्देशित सिफारिशें प्राप्त करने के लिए एक लक्षण दर्ज करें, जड़ी-बूटी के नाम से खोजें, स्वास्थ्य लक्ष्य चुनें, या त्वरित फ़िल्टर लागू करें।"}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-zinc-400">
                  <span>💡 {lang === "en" ? "Try 'Ashwagandha'" : "प्रयास करें 'अश्वगंधा'"}</span>
                  <span>•</span>
                  <span>🌿 {lang === "en" ? "Select 'Immunity'" : "'प्रतिरक्षा' फ़िल्टर"}</span>
                  <span>•</span>
                  <span>🔍 {lang === "en" ? "Use Remedy Finder" : "उपचार खोजक"}</span>
                </div>
              </div>
            ) : isLoading && filteredHerbs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-zinc-200/60 shadow-sm min-h-[400px]">
                <Loader2 className="h-12 w-12 text-[#1A2417] animate-spin mb-4" />
                <p className="text-zinc-500 text-sm font-medium">
                  {lang === "en" ? "Fetching herbs from database..." : "डेटाबेस से जड़ी-बूटियाँ प्राप्त की जा रही हैं..."}
                </p>
              </div>
            ) : filteredHerbs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-zinc-200/60 shadow-sm min-h-[350px]">
                <HelpCircle className="h-12 w-12 text-zinc-400 mb-4" />
                <h3 className="text-xl font-bold text-zinc-700 mb-2">
                  {lang === "en" ? "No Herbs Found" : "कोई जड़ी-बूटी नहीं मिली"}
                </h3>
                <p className="text-zinc-500 text-sm max-w-sm">
                  {lang === "en"
                    ? "We couldn't find any matching herbs in our database. Please try adjusting your search terms."
                    : "हमें हमारे डेटाबेस में कोई मेल खाने वाली जड़ी-बूटियाँ नहीं मिलीं। कृपया अपनी खोज शब्दों को समायोजित करने का प्रयास करें।"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
                  {filteredHerbs.map((plant) => (
                    <div
                      key={plant.id}
                      className="bg-white rounded-2xl overflow-hidden border border-zinc-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative h-full"
                    >
                      {/* Bookmark Button Overlay */}
                      <button
                        onClick={() => handleBookmark(plant.id)}
                        className="absolute top-3.5 right-3.5 z-10 w-8.5 h-8.5 rounded-xl bg-white/95 hover:bg-white text-zinc-600 shadow-md hover:scale-105 transition-all flex items-center justify-center border border-zinc-100"
                        aria-label="Bookmark Herb"
                      >
                        <Bookmark
                          className={`h-4.5 w-4.5 transition-all ${
                            bookmarks.includes(plant.id) ? "fill-yellow-400 text-yellow-500" : ""
                          }`}
                        />
                      </button>

                      {/* Image container */}
                      <div className="h-44 w-full bg-zinc-100 overflow-hidden relative">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>

                      {/* Content body */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold text-zinc-900 leading-snug">
                            {plant.name}
                          </h4>
                          <p className="text-[10.5px] text-zinc-400 italic font-medium mt-0.5">
                            {plant.scientificName}
                          </p>

                          {/* Benefits tags */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {plant.benefitsTags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#EBF2EA] text-[#1A2417] text-[10px] font-bold px-2.5 py-0.5 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs text-zinc-500 leading-relaxed mt-3.5 line-clamp-3">
                            {plant.description}
                          </p>
                        </div>

                        {/* Buttons actions */}
                        <div className="mt-5 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => openModal(plant, "benefits")}
                              className="bg-white border border-zinc-200 text-zinc-700 font-bold py-2 rounded-xl text-xs shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all text-center"
                            >
                              {lang === 'en' ? 'Benefits' : 'लाभ'}
                            </button>
                            <button
                              onClick={() => openModal(plant, "uses")}
                              className="bg-white border border-zinc-200 text-zinc-700 font-bold py-2 rounded-xl text-xs shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all text-center"
                            >
                              {lang === 'en' ? 'Uses' : 'उपयोग'}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => openModal(plant, "ai")}
                              className="bg-emerald-50 hover:bg-[#a8e063]/15 text-[#1A2417] border border-emerald-100 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Sparkles className="h-3.5 w-3.5 fill-[#1A2417]" />
                              <span>{lang === 'en' ? 'Ask AI' : 'एआई पूछें'}</span>
                            </button>
                            <button
                              onClick={() => navigate(`/virtual-tour/${plant.id}`)}
                              className="bg-[#a8e063] hover:bg-[#92cc53] text-[#1A2417] font-bold py-2 rounded-xl text-xs transition-all text-center"
                            >
                              {lang === 'en' ? 'Learn More' : 'और जानें'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION / LOAD MORE BUTTON */}
                {hasMore && (
                  <div className="flex justify-center pt-6 pb-2">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="bg-white hover:bg-zinc-50 text-[#1A2417] border border-zinc-200 hover:border-zinc-300 font-bold px-8 py-3.5 rounded-xl text-sm shadow-sm transition-all flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-[#1A2417]" />
                          <span>{lang === 'en' ? 'Loading more...' : 'और लोड हो रहा है...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{lang === 'en' ? 'Load More' : 'और दिखाएं'}</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ========================================== */}
            {/* BOTTOM SECTIONS: Insights & Precautions    */}
            {/* ========================================== */}
            {hasSearched && filteredHerbs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 animate-in fade-in duration-300">
                
                {/* AYURVEDIC INSIGHT PANEL */}
                <div className="bg-[#EBF2EA]/60 border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-3 text-[#1A2417]">
                    <BookOpen className="h-5 w-5" />
                    <h4 className="font-bold text-base">{lang === 'en' ? 'Ayurvedic Insight' : 'आयुर्वेदिक अंतर्दृष्टि'}</h4>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {aiInsight || getDynamicInsight()}
                  </p>
                </div>

                {/* GENERAL PRECAUTIONS PANEL */}
                <div className="bg-[#FAF6EC] border border-amber-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  {/* Background Leaf Deco */}
                  <div className="absolute right-[-1rem] bottom-[-1.5rem] opacity-5 pointer-events-none">
                    <svg width="150" height="150" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C12 22 18 18 20 12C22 6 22 2 22 2C22 2 18 2 12 4C6 6 2 12 2 12C2 12 6 16 12 22Z" fill="#1A2417" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-2.5 mb-3 text-amber-800">
                    <AlertTriangle className="h-5 w-5" />
                    <h4 className="font-bold text-base">{lang === 'en' ? 'General Precautions' : 'सामान्य सावधानियां'}</h4>
                  </div>
                  <ul className="text-xs text-amber-900/80 leading-relaxed space-y-2 list-disc pl-4 relative z-10">
                    <li>
                      {lang === 'en'
                        ? 'Consult an Ayurvedic expert or health practitioner for long-term usage.'
                        : 'दीर्घकालिक उपयोग के लिए एक आयुर्वेदिक विशेषज्ञ या चिकित्सक से परामर्श करें।'}
                    </li>
                    <li>
                      {lang === 'en'
                        ? 'Pregnant and lactating women should avoid self-medicating with extracts.'
                        : 'गर्भवती और स्तनपान कराने वाली महिलाओं को जड़ी-बूटियों के अर्क से स्वयं उपचार करने से बचना चाहिए।'}
                    </li>
                    <li>
                      {lang === 'en'
                        ? 'Always consume medicinal herbs in the recommended dosages to avoid heat imbalances.'
                        : 'गर्मी के असंतुलन से बचने के लिए हमेशा अनुशंसित खुराक में ही जड़ी-बूटियों का सेवन करें।'}
                    </li>
                  </ul>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* OVERLAY DIALOG MODAL                       */}
      {/* ========================================== */}
      {selectedPlant && modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            onClick={() => {
              setSelectedPlant(null);
              setModalType(null);
            }}
            className="absolute inset-0 bg-[#0a150c]/50 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col border border-zinc-200/50 max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-[#1A2417] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#a8e063]/20 flex items-center justify-center text-[#a8e063]">
                  {modalType === "benefits" ? (
                    <BookOpen className="h-5 w-5" />
                  ) : modalType === "uses" ? (
                    <Activity className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-snug">
                    {modalType === "benefits"
                      ? `${selectedPlant.name} - Benefits`
                      : modalType === "uses"
                      ? `${selectedPlant.name} - Usage & Dosage`
                      : `Ask AI about ${selectedPlant.name}`}
                  </h3>
                  <p className="text-[10.5px] text-emerald-300 italic font-medium mt-0.5">
                    {selectedPlant.scientificName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlant(null);
                  setModalType(null);
                }}
                className="w-9 h-9 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center justify-center"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto flex-1 leading-relaxed text-sm text-zinc-700 bg-[#FAF9F5]">
              
              {/* BENEFITS VIEW */}
              {modalType === "benefits" && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                    {lang === 'en' ? 'Health Advantages' : 'स्वास्थ्य लाभ'}
                  </p>
                  <ul className="space-y-3">
                    {selectedPlant.fullBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-3 items-start bg-white border border-zinc-200/50 p-3 rounded-xl shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <span className="text-zinc-700 font-medium leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Related Herbs Suggestion */}
                  <div className="mt-8 pt-5 border-t border-zinc-200">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                      {lang === 'en' ? 'Related Wellness Herbs' : 'संबंधित कल्याणकारी जड़ी-बूटियां'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlant.relatedHerbs.map((herb) => (
                        <span
                          key={herb}
                          className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-xl"
                        >
                          {herb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* USES VIEW */}
              {modalType === "uses" && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                    {lang === 'en' ? 'Traditional Usage & Dosage Guide' : 'पारंपरिक उपयोग और खुराक गाइड'}
                  </p>
                  <ul className="space-y-3">
                    {selectedPlant.detailedUses.map((use, idx) => (
                      <li key={idx} className="flex gap-3 items-start bg-white border border-zinc-200/50 p-4 rounded-xl shadow-sm">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-[#1A2417] text-xs font-bold mt-0.5">
                          ✓
                        </div>
                        <span className="text-zinc-700 font-medium leading-relaxed">{use}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Warning Precautions Block */}
                  <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed shadow-sm">
                    <div className="flex items-center gap-2 mb-2 font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span>{lang === 'en' ? 'Precautions' : 'सावधानियां'}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1">
                      {selectedPlant.precautions.map((prec, idx) => (
                        <li key={idx}>{prec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ASK AI CHAT VIEW */}
              {modalType === "ai" && (
                <div className="flex flex-col h-[500px] bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-inner">
                  {/* Message logs */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/20 scrollbar-hide">
                    {chatMessages.map((msg, idx) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm relative ${
                              isUser
                                ? "bg-[#1A2417] text-white rounded-tr-none shadow-sm"
                                : "bg-emerald-50/50 text-zinc-700 border border-emerald-100/30 rounded-tl-none shadow-sm flex items-start gap-2.5"
                            }`}
                          >
                            {!isUser && <Bot className="h-4 w-4 text-[#1A2417] mt-0.5 flex-shrink-0" />}
                            <div className="flex flex-col w-full">
                              <span className="whitespace-pre-line">{msg.text}</span>
                              {msg.timestamp && (
                                <span className={`block text-[9px] mt-1.5 text-right font-medium ${isUser ? "text-emerald-300/80" : "text-zinc-400"}`}>
                                  {msg.timestamp}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-emerald-50/50 text-zinc-700 border border-emerald-100/30 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2.5 shadow-sm">
                          <Bot className="h-4 w-4 text-[#1A2417] animate-bounce" />
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#1A2417] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-[#1A2417] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-[#1A2417] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* SUGGESTION BUTTONS */}
                  <div className="px-3 py-2 bg-[#FAF9F5] border-t border-zinc-100 flex flex-wrap gap-1.5 justify-center">
                    <button
                      onClick={() => handleSendSuggestion("benefits")}
                      className="bg-white hover:bg-emerald-50 text-zinc-600 hover:text-emerald-800 border border-zinc-200 hover:border-emerald-200 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      🌿 {lang === 'en' ? 'Benefits' : 'लाभ'}
                    </button>
                    <button
                      onClick={() => handleSendSuggestion("uses")}
                      className="bg-white hover:bg-emerald-50 text-zinc-600 hover:text-emerald-800 border border-zinc-200 hover:border-emerald-200 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      📋 {lang === 'en' ? 'Uses & Dosage' : 'उपयोग और खुराक'}
                    </button>
                    <button
                      onClick={() => handleSendSuggestion("precautions")}
                      className="bg-white hover:bg-emerald-50 text-zinc-600 hover:text-emerald-800 border border-zinc-200 hover:border-emerald-200 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      ⚠️ {lang === 'en' ? 'Precautions' : 'सावधानियां'}
                    </button>
                    <button
                      onClick={() => handleSendSuggestion("related")}
                      className="bg-white hover:bg-emerald-50 text-zinc-600 hover:text-emerald-800 border border-zinc-200 hover:border-emerald-200 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      🔗 {lang === 'en' ? 'Related Herbs' : 'संबंधित जड़ी-बूटियां'}
                    </button>
                    <button
                      onClick={() => handleSendSuggestion("ayur")}
                      className="bg-white hover:bg-emerald-50 text-zinc-600 hover:text-emerald-800 border border-zinc-200 hover:border-emerald-200 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      ✨ {lang === 'en' ? 'Ayurvedic Importance' : 'आयुर्वेदिक महत्व'}
                    </button>
                  </div>

                  {/* Input form */}
                  <div className="p-3 border-t border-zinc-100 bg-[#FAF9F5] flex gap-2">
                    <input
                      type="text"
                      placeholder={
                        lang === "en"
                          ? `Ask AI about ${selectedPlant.name}...`
                          : `${selectedPlant.name} के बारे में एआई से पूछें...`
                      }
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChatMessage();
                        }
                      }}
                      className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#1A2417] transition-all"
                    />
                    <button
                      onClick={() => handleSendChatMessage()}
                      disabled={isChatLoading || !chatInput.trim()}
                      className="bg-[#1A2417] hover:bg-[#2D3E29] text-white p-3.5 rounded-xl disabled:opacity-40 transition-all flex items-center justify-center"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Help helpers for Icons inside Quick filter Chips
const getChipIcon = (chip: string) => {
  switch (chip) {
    case "Immunity":
      return <Sparkles className="h-3.5 w-3.5" />;
    case "Hair Fall":
      return <Activity className="h-3.5 w-3.5" />;
    case "Skin Care":
      return <BookOpen className="h-3.5 w-3.5" />;
    case "Digestion":
      return <Check className="h-3.5 w-3.5" />;
    case "Stress Relief":
      return <HelpCircle className="h-3.5 w-3.5" />;
    case "Detox":
      return <Filter className="h-3.5 w-3.5" />;
    default:
      return <LeafIcon className="h-3.5 w-3.5" />;
  }
};

// Help Translation helpers for Hindi
const translateChip = (chip: string) => {
  switch (chip) {
    case "Immunity":
      return "प्रतिरक्षा";
    case "Hair Fall":
      return "बालों का झड़ना";
    case "Skin Care":
      return "त्वचा की देखभाल";
    case "Digestion":
      return "पाचन";
    case "Stress Relief":
      return "तनाव से राहत";
    case "Detox":
      return "डिटॉक्स";
    case "View All":
      return "सभी देखें";
    default:
      return chip;
  }
};

// Quick SVG Leaf Icon
const LeafIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17 8C8 8 4 12 2 22C12 20 16 16 17 8Z" />
    <path d="M22 2C14 2 10 6 8 16C18 14 21 10 22 2Z" opacity="0.8" />
  </svg>
);

export default Explore;
