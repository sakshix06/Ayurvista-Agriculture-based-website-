import { X, Volume2, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiPostJson, playBase64Audio } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface AssistantAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  answer: string;
  plantName: string | null;
  intent: string;
  language: "hi" | "en";
}

const AssistantAnswerModal = ({
  isOpen,
  onClose,
  answer,
  plantName,
  intent,
  language,
}: AssistantAnswerModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const handleTextToSpeech = async () => {
    if (!answer.trim()) {
      toast.error("No answer to speak");
      return;
    }

    try {
      setIsPlaying(true);
      const response = await apiPostJson<{
        audioBase64: string;
        mimeType: string;
      }>("/api/ai/tts", {
        text: answer,
        language: language,
      });

      await playBase64Audio(response.audioBase64, response.mimeType);

      toast.success(
        language === "hi" ? "ऑडियो चलाया गया!" : "Audio played successfully!"
      );
    } catch (error) {
      console.error("TTS error:", error);
      toast.error(
        language === "hi" ? "ऑडियो चलाने में विफल" : "Text-to-speech failed"
      );
    } finally {
      setIsPlaying(false);
    }
  };

  const getIntentLabel = () => {
    const hiLabels: Record<string, string> = {
      watering: "पानी देने के बारे में",
      sunlight: "प्रकाश के बारे में",
      soil: "मिट्टी के बारे में",
      benefits: "फायदे",
      uses: "उपयोग",
      medicinal: "औषधीय गुण",
      care: "देखभाल",
      temperature: "तापमान",
      description: "विवरण",
      general: "सामान्य जानकारी",
    };

    const enLabels: Record<string, string> = {
      watering: "Watering",
      sunlight: "Sunlight",
      soil: "Soil",
      benefits: "Benefits",
      uses: "Uses",
      medicinal: "Medicinal Properties",
      care: "Care",
      temperature: "Temperature",
      description: "Description",
      general: "General Information",
    };

    return language === "hi"
      ? hiLabels[intent] || "सामान्य जानकारी"
      : enLabels[intent] || "General Information";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#ABC8A2] to-[#8fb385] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Sprout className="w-6 h-6 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                {language === "hi" ? "पौधा सहायक उत्तर" : "Plant Assistant Answer"}
              </h2>

              {plantName && (
                <p className="text-sm text-white/90 mt-1">
                  {language === "hi" ? "पौधा: " : "Plant: "}
                  {plantName}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white/20 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto flex-1">
          <span className="inline-block px-3 py-1 bg-[#ABC8A2]/20 text-[#1A2417] rounded-full text-sm font-medium mb-4">
            {getIntentLabel()}
          </span>

          <div className="bg-gradient-to-br from-[#ABC8A2]/10 to-[#ABC8A2]/5 rounded-[20px] p-6 border border-[#ABC8A2]/20">
            <p className="text-[#1A2417] leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            onClick={handleTextToSpeech}
            disabled={isPlaying}
            className="flex-1 bg-[#ABC8A2] hover:bg-[#8fb385] text-white rounded-[20px] px-6 py-2.5 shadow-lg"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isPlaying
              ? language === "hi"
                ? "चल रहा है..."
                : "Playing..."
              : language === "hi"
              ? "उत्तर सुनें"
              : "Listen to Answer"}
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-2 border-[#ABC8A2] text-[#1A2417] hover:bg-[#ABC8A2]/20 rounded-[20px] px-6 py-2.5"
          >
            {language === "hi" ? "बंद करें" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantAnswerModal;

