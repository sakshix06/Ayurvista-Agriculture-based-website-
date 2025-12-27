
import GlobalNavigation from "@/components/GlobalNavigation";
import { plants } from "@/data/plants";
import { isBookmarked, toggleBookmark } from "@/utils/bookmarks";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";

const Explore = () => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    setBookmarks(JSON.parse(localStorage.getItem("herbal_bookmarks") || "[]"));
  }, []);

  const handleBookmark = (plantId: number) => {
    toggleBookmark(plantId);
    setBookmarks(JSON.parse(localStorage.getItem("herbal_bookmarks") || "[]"));
  };

  const navigate = useNavigate();

  const handleCardClick = (plantId: number) => {
    if (isBookmarked(plantId)) {
      navigate(`/virtual-tour/${plantId}`);
    }
  };

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#ABC8A2' }}>
      <GlobalNavigation />
      <div className="pt-24 container mx-auto px-4 pb-10">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1A2417' }}>{t('explore.title')}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-7">
          {plants.slice(0, 12).map((plant) => (
            <div
              key={plant.id}
              className="relative group rounded-xl hover:scale-105 transition-all cursor-pointer shadow-lg"
              style={{ minHeight: 250, backgroundColor: '#1A2417' }}
              onClick={() => handleCardClick(plant.id)}
            >
              {/* Bookmark */}
              <button
                className={`absolute top-3 right-3 z-10 rounded-full p-1.5 shadow-lg transition-all duration-300 transform hover:scale-110
                  ${isBookmarked(plant.id)
                    ? "hover:opacity-90"
                    : "hover:opacity-80"}
                `}
                style={isBookmarked(plant.id) 
                  ? { backgroundColor: '#ABC8A2', color: '#1A2417' }
                  : { backgroundColor: '#ABC8A2', color: '#1A2417' }}
                onClick={e => { e.stopPropagation(); handleBookmark(plant.id); }}
                aria-label={isBookmarked(plant.id) ? "Remove Bookmark" : "Save Bookmark"}
              >
                <Bookmark
                  size={20}
                  fill={isBookmarked(plant.id) ? "#fde047" : "none"}
                  strokeWidth={2}
                  className={`transition-all duration-300 ${isBookmarked(plant.id) ? "fill-yellow-400" : ""}`}
                />
              </button>
              {/* Image */}
              <div className="flex items-center justify-center h-32 sm:h-36 mt-4 sm:mt-6 mb-2">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-lg drop-shadow"
                  style={{ background: "white" }}
                />
              </div>
              {/* Name */}
              <div className="flex flex-col justify-end h-16 sm:h-16 pb-3">
                <span className="block text-center text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow px-1">{plant.name}</span>
                <span className="block text-[10px] sm:text-[11px] text-center text-green-200 opacity-80 px-1">
                  {isBookmarked(plant.id) ? t('explore.virtualTourAvailable') : t('explore.virtualTourBookmark')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
