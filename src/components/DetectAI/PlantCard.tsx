import { Plant } from "@/data/popularPlants";
import { useI18n } from "@/i18n/I18nProvider";

interface PlantCardProps {
  plant: Plant;
  onClick: (plant: Plant) => void;
}

const PlantCard = ({ plant, onClick }: PlantCardProps) => {
  const { t } = useI18n();

  return (
    <div
      onClick={() => onClick(plant)}
      className="
        group relative w-full cursor-pointer
        rounded-2xl border border-green-100
        bg-gradient-to-br from-white via-[#F6FBF4] to-[#ECF5EE]
        p-6 transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_45px_rgba(26,36,23,0.18)]
      "
    >
      {/* subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-center gap-6">
        {/* Plant Image */}
        <div
          className="
            w-20 h-20 rounded-2xl
            bg-gradient-to-br from-green-100 to-green-50
            border border-green-200
            flex items-center justify-center
            text-3xl shadow-inner
            flex-shrink-0
          "
        >
          {plant.image}
        </div>

        {/* Plant Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-[#1A2417] mb-1 tracking-tight">
            {plant.commonName}
          </h3>

          <p className="text-sm italic text-gray-500 mb-3">
            {plant.botanicalName}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span>💧</span>
              <span>{plant.waterRequirement}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>☀️</span>
              <span>{plant.lightCondition}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{plant.frequency}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>🌡️</span>
              <span>{plant.temperatureRange}</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div
          className="
            flex-shrink-0 text-green-700
            opacity-40 group-hover:opacity-100
            transition-all duration-300
            group-hover:translate-x-1
          "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
