
import GlobalNavigation from "@/components/GlobalNavigation";
import { Card } from "@/components/ui/card";
import { Bookmark, X } from "lucide-react";
import { plants } from "@/data/plants";
import { getBookmarks, toggleBookmark } from "@/utils/bookmarks";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    setBookmarks(getBookmarks());
    const onStorage = () => setBookmarks(getBookmarks());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleUnbookmark = (plantId: number) => {
    toggleBookmark(plantId);
    setBookmarks(getBookmarks());
  };

  const bookmarkedPlants = plants.filter(p => bookmarks.includes(p.id));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ABC8A2' }}>
      <GlobalNavigation />
      <div className="pt-24 container mx-auto px-4 pb-10">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1A2417' }}>{t('bookmarks.title')}</h1>
        {bookmarkedPlants.length === 0 ? (
          <p className="text-gray-500">{t('bookmarks.empty')}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {bookmarkedPlants.map((plant) => (
              <div key={plant.id} className="relative group">
                <Link to={`/virtual-tour/${plant.id}`}>
                  <div
                    className={`relative group rounded-xl hover:scale-105 transition-all cursor-pointer shadow-lg`}
                    style={{ minHeight: 250, backgroundColor: '#1A2417' }}
                  >
                    <div className="flex items-center justify-center h-32 sm:h-36 mt-4 sm:mt-6 mb-2">
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-lg drop-shadow"
                        style={{ background: "white" }}
                      />
                    </div>
                    <div className="flex flex-col justify-end h-16 sm:h-16 pb-3">
                      <span className="block text-center text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow px-1">
                        {plant.name}
                      </span>
                      <span className="block text-[10px] sm:text-[11px] text-center text-green-200 opacity-80 px-1">{t('explore.virtualTourAvailable')}</span>
                    </div>
                  </div>
                </Link>
                
                {/* Unbookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnbookmark(plant.id);
                  }}
                  className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-300 transform hover:scale-110"
                  title={t('bookmarks.unbookmark')}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;

