import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import { apiPostJson } from "@/lib/utils";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";
import AssistantAnswerModal from "./AssistantAnswerModal";

interface VoiceRecognitionProps {
  onPlantIdentified?: (plantName: string) => void;
}

interface AssistantAnswer {
  answer: string;
  plantName: string | null;
  intent: string;
  language: "hi" | "en";
  fromDatabase: boolean;
}

const VoiceRecognition = ({ onPlantIdentified }: VoiceRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assistantAnswer, setAssistantAnswer] =
    useState<AssistantAnswer | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const { t } = useI18n();

  /* 🔈 TEXT → SPEECH */
  const speakAnswer = (text: string, language: "hi" | "en") => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  /* 🎤 START RECORDING */
  const handleStartRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-IN"; // 🌍 AUTO (Hindi + English)
    recognition.interimResults = false;
    recognition.continuous = false;

    setIsRecording(true);
    setIsProcessing(false);
    setAssistantAnswer(null);

    recognition.start();

    recognition.onresult = async (event: any) => {
      const query = event.results[0][0].transcript;
      console.log("🎤 Heard:", query);

      setIsRecording(false);
      setIsProcessing(true);

      try {
        const detectedLanguage: "hi" | "en" =
          /[\u0900-\u097F]/.test(query) ? "hi" : "en";

        const qaResponse = await apiPostJson<AssistantAnswer>(
          "/api/ai/plant-qa",
          {
            query,
            language: detectedLanguage,
          }
        );

        setAssistantAnswer(qaResponse);
        setIsAssistantOpen(true);

        speakAnswer(qaResponse.answer, qaResponse.language);

        if (onPlantIdentified && qaResponse.plantName) {
          onPlantIdentified(qaResponse.plantName);
        }

        toast.success(
          detectedLanguage === "hi" ? "उत्तर मिल गया!" : "Answer received!"
        );
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Failed to process question");
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setIsProcessing(false);
      toast.error("Voice recognition failed");
      recognition.stop();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  /* 🛑 STOP RECORDING */
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // ✅ REAL STOP
      recognitionRef.current = null;
    }
    setIsRecording(false);
    window.speechSynthesis.cancel();
  };

  const handleCloseModal = () => {
    window.speechSynthesis.cancel();
    setIsAssistantOpen(false);
    setAssistantAnswer(null);
  };

  return (
    <>
      <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(26,36,23,0.08)] w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-[#1A2417] mb-2 text-center">
          AI Plant Voice Assistant
        </h2>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Ask about plants in Hindi or English
        </p>

        <div className="relative flex items-center justify-center w-32 h-32 mb-4">
          <div
            className={`absolute w-32 h-32 rounded-full ${
              isRecording
                ? "bg-red-400/30 animate-ping"
                : "bg-[#ABC8A2]/20"
            } blur-xl`}
          />

          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className={`relative w-24 h-24 rounded-full text-white shadow-xl ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-[#1A2417] hover:bg-[#2a3a27]"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-10 h-10" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </Button>
        </div>

        <p className="text-sm text-center">
          {isRecording
            ? "Listening..."
            : isProcessing
            ? "Processing..."
            : "Tap to speak"}
        </p>

        {isRecording && (
          <Button
            onClick={handleStopRecording}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white rounded-[20px]"
          >
            <Square className="w-4 h-4 mr-2" />
            {t("ai.stopRecording")}
          </Button>
        )}
      </div>

      {assistantAnswer && (
        <AssistantAnswerModal
          isOpen={isAssistantOpen}
          onClose={handleCloseModal}
          answer={assistantAnswer.answer}
          plantName={assistantAnswer.plantName}
          intent={assistantAnswer.intent}
          language={assistantAnswer.language}
        />
      )}
    </>
  );
};

export default VoiceRecognition;
