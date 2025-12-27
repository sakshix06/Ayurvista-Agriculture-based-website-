import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Filter } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

interface HeaderProps {
  onSearch: (query: string) => void;
  onVoiceInput: () => void;
  onFilter: () => void;
}

const Header = ({ onSearch, onVoiceInput, onFilter }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useI18n();
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Get logged-in user name from localStorage
  const userName = localStorage.getItem("herbalgarden_username") || "Mike";

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setSearchQuery(finalTranscript);
          onSearch(finalTranscript);
          setIsListening(false);
          setIsProcessing(false);
          toast.success(`Voice search: "${finalTranscript}"`);
        } else if (interimTranscript) {
          setSearchQuery(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow microphone access.');
        } else {
          toast.error('Voice recognition failed. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };
    }
  }, [onSearch]);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    } else {
      setSearchQuery('');
      recognitionRef.current.start();
      setIsListening(true);
      setIsProcessing(false);
      toast.info('Listening... Speak now!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-green-600 font-semibold text-sm">👤</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-600 text-sm truncate">{t('home.greeting').replace('Mike', userName)}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{t('home.findPlants')}</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl p-3 space-x-3 shadow-sm border border-gray-200">
          <div className="flex-1 flex items-center space-x-3 min-w-0">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              type="text"
              placeholder={t('ai.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 bg-transparent focus-visible:ring-0 text-gray-700 placeholder:text-gray-400 flex-1 min-w-0"
            />
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={`p-2 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-100 hover:bg-red-200 animate-pulse' 
                  : 'hover:bg-green-100'
              }`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-red-600" />
              ) : (
                <Mic className="w-5 h-5 text-green-600" />
              )}
            </Button>
            <Button
              onClick={onFilter}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
