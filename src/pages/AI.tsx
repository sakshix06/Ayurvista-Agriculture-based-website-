import ImageUpload from "@/components/DetectAI/ImageUpload";
import VoiceRecognition from "@/components/DetectAI/VoiceRecognition";
import { toast } from "sonner";

const AIPage = () => {
  const handlePlantIdentified = (result: {
    species: string;
    description: string;
  }) => {
    toast.success(`Plant identified: ${result.species}`);
  };

  const handleVoicePlantIdentified = (plantName: string) => {
    toast.info(`Voice recognized: ${plantName}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F6FAF5] via-white to-[#EEF5EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 🌿 HERO HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1A2417] mb-4 tracking-tight">
            AI Plant Detector
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Identify plants instantly using images or ask questions through voice —
            powered by intelligent AI assistance.
          </p>
        </div>

        {/* 🌱 MAIN AI CARDS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Upload Image Card */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(26,36,23,0.08)] border border-[#ABC8A2]/30 p-6">
            <div className="absolute -top-3 left-6 bg-[#ABC8A2] text-[#1A2417] text-xs font-semibold px-3 py-1 rounded-full">
              IMAGE
            </div>

            <ImageUpload onPlantIdentified={handlePlantIdentified} />
          </div>

          {/* Voice Assistant Card */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(26,36,23,0.08)] border border-[#ABC8A2]/30 p-6">
            <div className="absolute -top-3 left-6 bg-[#1A2417] text-white text-xs font-semibold px-3 py-1 rounded-full">
              VOICE AI
            </div>

            <VoiceRecognition onPlantIdentified={handleVoicePlantIdentified} />
          </div>
        </div>

        {/* 🌿 FOOT NOTE */}
        <p className="text-center text-xs text-gray-400 mt-12">

        </p>
      </div>
    </div>
  );
};

export default AIPage;
