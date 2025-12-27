
import { plants } from "@/data/plants";
import GlobalNavigation from "@/components/GlobalNavigation";
import { useState } from "react";

interface ImmunityPlant {
  id: number;
  name: string;
  image: string;
  description?: string;
  tourVideo?: string;
}

export default function ImmunityBooster() {
  // Filter plants belonging to Immunity Booster category
  const immunityPlants = plants.filter((p) => p.category === "immunity");

  const [selected, setSelected] = useState<ImmunityPlant | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-50 to-green-100 pb-8">
      <GlobalNavigation />
      <div className="pt-24 container mx-auto px-4 pb-10">
        <h1 className="text-3xl font-bold mb-8 text-green-800 text-center">Immunity Booster Plants</h1>
        <div className="flex flex-wrap justify-center gap-8">
          {immunityPlants.map((plant) => (
            <div
              key={plant.id}
              className="bg-green-700 w-64 rounded-xl drop-shadow-xl cursor-pointer transition-transform hover:scale-105 p-4 text-center"
              onClick={() => setSelected(plant)}
            >
              {/* === Plant Image Section === */}
              {/* To update image, edit the 'image' property in data/plants.ts */}
              <img src={plant.image} alt={plant.name} className="w-28 h-28 mx-auto mb-3 rounded-lg bg-white object-contain" />
              <div className="text-xl font-bold text-white">{plant.name}</div>
            </div>
          ))}
        </div>
        {/* === Modal: Plant Details with Description & YouTube Video === */}
        {selected && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-30 bg-black/40">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl text-center relative">
              <button
                className="absolute top-2 right-4 text-2xl text-green-600 hover:text-green-900"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >&times;</button>
              {/* Image header */}
              <img src={selected.image} alt={selected.name} className="w-36 h-36 mx-auto rounded-lg mb-3 object-contain" />
              <div className="text-2xl font-bold text-green-900 mb-3">{selected.name}</div>
              {/* Description */}
              <div className="text-lg mb-3 text-green-800">{selected.description}</div>
              {/* === YouTube Video Section === */}
              {/* To update video, edit the 'tourVideo' property in data/plants.ts */}
              {selected.tourVideo && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-green-300 bg-black mb-2">
                  <iframe
                    src={selected.tourVideo}
                    title={`${selected.name} Immunity Booster Video`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
