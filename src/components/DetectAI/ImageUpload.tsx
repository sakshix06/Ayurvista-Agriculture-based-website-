import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";
import { apiPostJson } from "@/lib/utils";

interface ImageUploadProps {
  onPlantIdentified?: (result: { species: string; description: string }) => void;
}

const ImageUpload = ({ onPlantIdentified }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ species: string; description: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
      setResult(null);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await apiPostJson<{ 
        species: string; 
        description: string; 
        medicinal: boolean; 
        confidence: number 
      }>("/api/ai/plant-identify", {
        imageBase64: selectedImage
      });

      setResult({
        species: response.species,
        description: response.description
      });

      if (onPlantIdentified) {
        onPlantIdentified({
          species: response.species,
          description: response.description
        });
      }

      toast.success("Plant identified successfully!");
    } catch (error: any) {
      console.error("Plant identification error:", error);
      const errorMessage = error?.message || "Failed to identify plant. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(26,36,23,0.08)] w-full flex flex-col">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#1A2417] mb-2 text-center">Upload Image</h2>
        <p className="text-sm text-gray-500 text-center">Upload a plant image for AI identification</p>
      </div>
      
      <div className="space-y-6 flex-1">
        {/* Image Upload Area */}
        {!selectedImage ? (
          <div 
            onClick={handleClickUpload}
            className="border-2 border-dashed border-[#ABC8A2] rounded-[20px] p-12 sm:p-16 text-center cursor-pointer bg-gradient-to-br from-[#f8faf8] to-white hover:border-[#1A2417] hover:shadow-[0_0_30px_rgba(171,200,162,0.3)] transition-all duration-300 min-h-[280px] flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#ABC8A2] to-[#8fb385] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Upload className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-[#1A2417] font-medium mb-2 text-lg">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Preview Image */}
            <div className="relative rounded-[20px] overflow-hidden border-2 border-[#ABC8A2]/30 shadow-md">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="w-full h-56 sm:h-72 object-cover"
              />
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2.5 shadow-lg transition-all hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={handleClickUpload}
                variant="outline"
                className="flex-1 rounded-[20px] border-2 border-[#ABC8A2] text-[#1A2417] hover:bg-[#ABC8A2]/10 hover:border-[#1A2417] transition-all"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Change Image
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isProcessing}
                className="flex-1 bg-[#1A2417] hover:bg-[#2a3a27] text-white rounded-[20px] shadow-lg hover:shadow-xl transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Identifying...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Identify Plant
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-gradient-to-br from-[#ABC8A2]/10 to-[#ABC8A2]/5 rounded-[20px] p-6 space-y-4 border border-[#ABC8A2]/20">
            <h3 className="font-semibold text-[#1A2417] text-xl mb-4">Identification Result</h3>
            <div>
              <p className="text-sm font-semibold text-[#1A2417]/70 mb-2">Plant Name:</p>
              <p className="text-[#1A2417] font-medium text-lg">{result.species}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A2417]/70 mb-2">Description:</p>
              <p className="text-[#1A2417]/80 text-sm leading-relaxed">{result.description}</p>
            </div>
            <Button
              onClick={handleClear}
              variant="outline"
              className="w-full rounded-[20px] border-2 border-[#ABC8A2] text-[#1A2417] hover:bg-[#ABC8A2]/20 transition-all mt-4"
            >
              Identify Another Plant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

