import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

type LanguageCode = "en" | "hi";

type Translations = Record<string, string>;

interface I18nContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const I18N_STORAGE_KEY = "ayurvista_lang";

const en: Translations = {
  "nav.home": "HOME",
  "nav.search": "SEARCH",
  "nav.bookmarks": "BOOKMARKS",
  "nav.about": "ABOUT",
  "nav.shop": "SHOP",
  "nav.consultation": "CONSULTATION",
  "nav.blog": "BLOG",
  "nav.contact": "CONTACT US",
  "nav.aidetector": "AiDetector",
  "brand.name": "Ayurvista",
  "home.title": "Virtual Herbal Garden",
  "home.subtitle": "Welcome to the Virtual Herbal Garden, where you can explore a vast collection of herbs and medicinal plants from the comfort of your home.",
  "home.startTour": "Start The Virtual Tour",
  "home.greeting": "Hello, Mike!",
  "home.findPlants": "Let's find your plants!",
  "chat.open": "Ask Your Herbal Expert",
  "chat.header": "Herbal Expert",
  "chat.placeholder": "Ask about herbs...",
  "chat.initial": "Hello! I'm your herbal expert. How can I help you today?",
  "chat.genericReply": "Thank you for your question! Our herbal experts will help you with information about medicinal plants and their benefits.",
  "auth.title.login": "Please Enter Your Login Details",
  "auth.title.register": "Create your AyurVista account",
  "auth.switch.toSignup": "Go to Sign up",
  "auth.switch.toLogin": "Go to Login",
  "auth.remember": "Remember me",
  "auth.login": "Login",
  "auth.signup": "Sign up",
  "auth.placeholder.email": "Enter Email Address",
  "auth.placeholder.password": "Enter Password",
  "auth.placeholder.name": "Your Name",
  "auth.placeholder.emailShort": "Email Address",
  "auth.placeholder.passwordCreate": "Create Password",
  "auth.noAccount": "Don't have an account?",
  "auth.haveAccount": "Already have an account?",
  "auth.cta.register": "Register",
  "auth.cta.login": "Login",
  "lang.english": "English",
  "lang.hindi": "हिन्दी",
  // AI Detection Page
  "ai.searchPlaceholder": "e.g. Blue Sage",
  "ai.popularPlants": "Popular Plants",
  "ai.recentlyViewed": "Recently Viewed",
  "ai.ayurvedicPlants": "Ayurvedic Plants",
  "ai.liveScanner": "Live Scanner",
  "ai.voiceRecognition": "Voice Recognition",
  "ai.startScanning": "Start Scanning",
  "ai.stopScanning": "Stop Scanning",
  "ai.identifyPlant": "Identify Plant",
  "ai.scanAnother": "Scan Another Plant",
  "ai.startRecording": "Start Recording",
  "ai.stopRecording": "Stop Recording",
  "ai.speakText": "Speak Text",
  "ai.clearText": "Clear Text",
  "ai.recognizedText": "Recognized Text:",
  "ai.learnMore": "Learn More",
  "ai.save": "Save",
  "ai.commonName": "Common Name:",
  "ai.botanicalName": "Botanical Name:",
  "ai.water": "Water",
  "ai.light": "Light",
  "ai.frequency": "Frequency",
  "ai.temperature": "Temperature",
  "ai.description": "Description",
  // Plant Names
  "plant.aloeVera": "Aloe Vera",
  "plant.goldenMoneyPlant": "Golden Money Plant",
  "plant.cactus": "Cactus",
  "plant.autumnFern": "Autumn Fern",
  "plant.monstera": "Monstera Deliciosa",
  "plant.coffeeFern": "Coffee Fern",
  "plant.ashwagandha": "Ashwagandha",
  "plant.brahmi": "Brahmi",
  "plant.amla": "Amla (Indian Gooseberry)",
  "plant.neem": "Neem",
  "plant.moringa": "Moringa (Drumstick Tree)",
  // User menu
  "user.profile": "Profile",
  "user.logout": "Logout",
  // Explore page
  "explore.title": "Explore Medicinal Plants",
  "explore.virtualTourAvailable": "Virtual Tour: Available",
  "explore.virtualTourBookmark": "Virtual Tour: Bookmark to Unlock",
  "explore.bookmarkToUnlock": "Bookmark to Unlock",
  // Bookmarks page
  "bookmarks.title": "Bookmarked Plants",
  "bookmarks.empty": "No bookmarks yet. Start exploring!",
  "bookmarks.unbookmark": "Unbookmark",
  // Auth messages
  "auth.confirmPassword": "Confirm Password",
  "auth.passwordMismatch": "Passwords do not match",
  "auth.passwordTooShort": "Password must be at least 6 characters long",
  "auth.signingIn": "Signing in...",
  "auth.creatingAccount": "Creating Account...",
  "auth.emailSent": "Confirmation email sent to your registered email ID.",
  "auth.welcomeBack": "Welcome back to AyurVista!",
  "auth.welcomeNew": "Account created. Welcome to AyurVista!",
  "auth.logoutSuccess": "Logged out successfully"
};

const hi: Translations = {
  "nav.home": "होम",
  "nav.search": "खोज",
  "nav.bookmarks": "बुकमार्क",
  "nav.about": "हमारे बारे में",
  "nav.shop": "दुकान",
  "nav.consultation": "परामर्श",
  "nav.blog": "ब्लॉग",
  "nav.contact": "संपर्क करें",
  "nav.aidetector": "AiDetector",
  "brand.name": "आयुर्विस्टा",
  "home.title": "वर्चुअल हर्बल गार्डन",
  "home.subtitle": "वर्चुअल हर्बल गार्डन में आपका स्वागत है, जहाँ आप घर बैठे जड़ी-बूटियों और औषधीय पौधों के विशाल संग्रह का अन्वेषण कर सकते हैं।",
  "home.startTour": "वर्चुअल टूर शुरू करें",
  "home.greeting": "नमस्ते, माइक!",
  "home.findPlants": "आइए आपके पौधों को खोजते हैं!",
  "chat.open": "अपने हर्बल विशेषज्ञ से पूछें",
  "chat.header": "हर्बल विशेषज्ञ",
  "chat.placeholder": "जड़ी-बूटियों के बारे में पूछें...",
  "chat.initial": "नमस्ते! मैं आपका हर्बल विशेषज्ञ हूँ। मैं आज आपकी कैसे मदद कर सकता/सकती हूँ?",
  "chat.genericReply": "आपके प्रश्न के लिए धन्यवाद! हमारे हर्बल विशेषज्ञ औषधीय पौधों और उनके लाभों के बारे में आपकी मदद करेंगे।",
  "auth.title.login": "कृपया अपने लॉगिन विवरण दर्ज करें",
  "auth.title.register": "अपना AyurVista खाता बनाएं",
  "auth.switch.toSignup": "साइन अप पर जाएं",
  "auth.switch.toLogin": "लॉगिन पर जाएं",
  "auth.remember": "मुझे याद रखें",
  "auth.login": "लॉगिन",
  "auth.signup": "साइन अप",
  "auth.placeholder.email": "ईमेल पता दर्ज करें",
  "auth.placeholder.password": "पासवर्ड दर्ज करें",
  "auth.placeholder.name": "आपका नाम",
  "auth.placeholder.emailShort": "ईमेल पता",
  "auth.placeholder.passwordCreate": "पासवर्ड बनाएं",
  "auth.noAccount": "खाता नहीं है?",
  "auth.haveAccount": "क्या आपके पास खाता है?",
  "auth.cta.register": "रजिस्टर",
  "auth.cta.login": "लॉगिन",
  "lang.english": "English",
  "lang.hindi": "हिन्दी",
  // AI Detection Page
  "ai.searchPlaceholder": "जैसे नीला ऋषि",
  "ai.popularPlants": "लोकप्रिय पौधे",
  "ai.recentlyViewed": "हाल ही में देखे गए",
  "ai.ayurvedicPlants": "आयुर्वेदिक पौधे",
  "ai.liveScanner": "लाइव स्कैनर",
  "ai.voiceRecognition": "आवाज पहचान",
  "ai.startScanning": "स्कैनिंग शुरू करें",
  "ai.stopScanning": "स्कैनिंग रोकें",
  "ai.identifyPlant": "पौधा पहचानें",
  "ai.scanAnother": "दूसरा पौधा स्कैन करें",
  "ai.startRecording": "रिकॉर्डिंग शुरू करें",
  "ai.stopRecording": "रिकॉर्डिंग रोकें",
  "ai.speakText": "टेक्स्ट बोलें",
  "ai.clearText": "टेक्स्ट साफ करें",
  "ai.recognizedText": "पहचाना गया टेक्स्ट:",
  "ai.learnMore": "और जानें",
  "ai.save": "सहेजें",
  "ai.commonName": "सामान्य नाम:",
  "ai.botanicalName": "वनस्पति नाम:",
  "ai.water": "पानी",
  "ai.light": "प्रकाश",
  "ai.frequency": "आवृत्ति",
  "ai.temperature": "तापमान",
  "ai.description": "विवरण",
  // Plant Names
  "plant.aloeVera": "एलोवेरा",
  "plant.goldenMoneyPlant": "गोल्डन मनी प्लांट",
  "plant.cactus": "कैक्टस",
  "plant.autumnFern": "ऑटम फर्न",
  "plant.monstera": "मॉन्स्टेरा डेलिसिओसा",
  "plant.coffeeFern": "कॉफी फर्न",
  "plant.ashwagandha": "अश्वगंधा",
  "plant.brahmi": "ब्राह्मी",
  "plant.amla": "आंवला (भारतीय करौंदा)",
  "plant.neem": "नीम",
  "plant.moringa": "मोरिंगा (सहजन)",
  // User menu
  "user.profile": "प्रोफाइल",
  "user.logout": "लॉगआउट",
  // Explore page
  "explore.title": "औषधीय पौधों का अन्वेषण करें",
  "explore.virtualTourAvailable": "वर्चुअल टूर: उपलब्ध",
  "explore.virtualTourBookmark": "वर्चुअल टूर: अनलॉक करने के लिए बुकमार्क करें",
  "explore.bookmarkToUnlock": "अनलॉक करने के लिए बुकमार्क करें",
  // Bookmarks page
  "bookmarks.title": "बुकमार्क किए गए पौधे",
  "bookmarks.empty": "अभी तक कोई बुकमार्क नहीं। अन्वेषण शुरू करें!",
  "bookmarks.unbookmark": "बुकमार्क हटाएं",
  // Auth messages
  "auth.confirmPassword": "पासवर्ड की पुष्टि करें",
  "auth.passwordMismatch": "पासवर्ड मेल नहीं खाते",
  "auth.passwordTooShort": "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
  "auth.signingIn": "साइन इन हो रहे हैं...",
  "auth.creatingAccount": "खाता बनाया जा रहा है...",
  "auth.emailSent": "पुष्टि ईमेल आपके पंजीकृत ईमेल आईडी पर भेजा गया।",
  "auth.welcomeBack": "आयुर्विस्टा में वापस स्वागत है!",
  "auth.welcomeNew": "खाता बनाया गया। आयुर्विस्टा में स्वागत है!",
  "auth.logoutSuccess": "सफलतापूर्वक लॉग आउट हो गए"
};

const ALL_TRANSLATIONS: Record<LanguageCode, Translations> = { en, hi };

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(I18N_STORAGE_KEY) as LanguageCode | null;
    return saved || "en";
  });

  useEffect(() => {
    localStorage.setItem(I18N_STORAGE_KEY, lang);
  }, [lang]);

  const setLang = (l: LanguageCode) => setLangState(l);

  const toggleLanguage = useCallback(() => {
    const newLang = lang === "en" ? "hi" : "en";
    console.log('Toggling language from', lang, 'to', newLang);
    setLangState(newLang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = ALL_TRANSLATIONS[lang] || en;
    return (key: string) => dict[key] || key;
  }, [lang]);

  const value: I18nContextValue = useMemo(() => ({ lang, setLang, toggleLanguage, t }), [lang, t, toggleLanguage]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export type { LanguageCode };


