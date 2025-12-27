import { Plant } from "@/data/popularPlants";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface PlantDetailModalProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlantDetailModal = ({ plant, isOpen, onClose }: PlantDetailModalProps) => {
  const { t } = useI18n();
  
  if (!plant || !isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="relative p-4 pb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Plant Image Section */}
        <div className="bg-green-50 rounded-b-3xl p-8 flex justify-center">
          <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-6xl shadow-sm">
            {plant.image}
          </div>
        </div>

        {/* Plant Info */}
        <div className="p-6 space-y-6">
          {/* Plant Name */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">{plant.commonName}</h2>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">{t('ai.botanicalName')}</span> {plant.botanicalName}
            </p>
          </div>

          {/* Care Information Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">💧</div>
              <p className="text-xs text-gray-600 font-medium">{t('ai.water')}</p>
              <p className="text-sm font-semibold text-gray-900">{plant.waterRequirement}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">☀️</div>
              <p className="text-xs text-gray-600 font-medium">{t('ai.light')}</p>
              <p className="text-sm font-semibold text-gray-900">{plant.lightCondition}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">📅</div>
              <p className="text-xs text-gray-600 font-medium">{t('ai.frequency')}</p>
              <p className="text-sm font-semibold text-gray-900">{plant.frequency}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">🌡️</div>
              <p className="text-xs text-gray-600 font-medium">{t('ai.temperature')}</p>
              <p className="text-sm font-semibold text-gray-900">{plant.temperatureRange}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">{t('ai.description')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{plant.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              className="flex-1 rounded-2xl border-gray-200 hover:bg-gray-50 w-full sm:w-auto"
            >
              <Heart className="w-4 h-4 mr-2" />
              {t('ai.save')}
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl w-full sm:w-auto"
            >
              {t('ai.learnMore')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailModal;
