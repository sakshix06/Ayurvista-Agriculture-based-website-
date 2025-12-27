import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Heart } from "lucide-react";
import { Plant } from "@/data/popularPlants";
import { useI18n } from "@/i18n/I18nProvider";

interface LiveScannerProps {
  onPlantIdentified: (plant: Plant) => void;
}

const LiveScanner = ({ onPlantIdentified }: LiveScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPlant, setScannedPlant] = useState<Plant | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useI18n();

  const startScanning = async () => {
    try {
      // Request camera with mobile-friendly constraints
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Ensure video plays on mobile
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback: simulate plant identification
      setTimeout(() => {
        const mockPlant: Plant = {
          id: "calathea",
          commonName: "Calathea",
          botanicalName: "Calathea Goeppertia Veitchiana",
          image: "🌿",
          waterRequirement: "250-500 ml",
          lightCondition: "Part shade",
          frequency: "1 time a week",
          temperatureRange: "17-24°C",
          description: "Calathea plants are part of the family of plants known as Marantaceae, which is a species of flowering plants from tropical areas such as Africa. They are famous for their wide, green, colorful leaves. Low light conditions are preferred for optimal growth."
        };
        setScannedPlant(mockPlant);
        setIsScanning(false);
      }, 2000);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const captureAndIdentify = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Simulate API call to Gemini
        setTimeout(() => {
          const mockPlant: Plant = {
            id: "calathea",
            commonName: "Calathea",
            botanicalName: "Calathea Goeppertia Veitchiana",
            image: "🌿",
            waterRequirement: "250-500 ml",
            lightCondition: "Part shade",
            frequency: "1 time a week",
            temperatureRange: "17-24°C",
            description: "Calathea plants are part of the family of plants known as Marantaceae, which is a species of flowering plants from tropical areas such as Africa. They are famous for their wide, green, colorful leaves. Low light conditions are preferred for optimal growth."
          };
          setScannedPlant(mockPlant);
          stopScanning();
        }, 1500);
      }
    }
  };

  const handleLearnMore = () => {
    if (scannedPlant) {
      onPlantIdentified(scannedPlant);
      setScannedPlant(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">{t('ai.liveScanner')}</h2>
      
      {!isScanning && !scannedPlant && (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">Point your camera at a plant to identify it</p>
          <Button
            onClick={startScanning}
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6"
          >
            {t('ai.startScanning')}
          </Button>
        </div>
      )}

      {isScanning && (
        <div className="relative">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-4 border-yellow-400 border-dashed rounded-2xl flex items-center justify-center">
                <div className="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={stopScanning}
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-4 sm:px-6 w-full sm:w-auto"
            >
              {t('ai.stopScanning')}
            </Button>
            <Button
              onClick={captureAndIdentify}
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-4 sm:px-6 w-full sm:w-auto"
            >
              {t('ai.identifyPlant')}
            </Button>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {scannedPlant && (
        <div className="text-center space-y-4">
          <div className="bg-green-50 rounded-2xl p-4">
            <h3 className="text-lg font-bold text-green-600 mb-2">
              It's {scannedPlant.commonName}!
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full p-2"
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleLearnMore}
                className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6"
              >
                {t('ai.learnMore')}
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setScannedPlant(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-2xl px-6"
          >
            {t('ai.scanAnother')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LiveScanner;
