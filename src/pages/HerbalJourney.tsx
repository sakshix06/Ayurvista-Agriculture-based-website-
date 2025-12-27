// src/pages/HerbalJourney.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge"; // optional if you have these
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
 // optional icon - install lucide-react or replace
import GlobalNavigation from "@/components/GlobalNavigation";
import "./herbal-journey.css"; // small extra CSS for decorative bits (see file below)

type Plant = {
  id: number;
  name: string;
  short: string;
  image: string;
  benefits: string[];
  difficulty?: "easy" | "medium" | "hard";
};

const SEED_PLANTS: Plant[] = [
  {
    id: 1,
    name: "Tulsi",
    short: "Holy basil",
    image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
    benefits: ["Immunity", "Respiratory health", "Anti-inflammatory"],
    difficulty: "easy",
  },
  {
    id: 2,
    name: "Aloe Vera",
    short: "Aloe",
    image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png",
    benefits: ["Skin healing", "Digestive health"],
    difficulty: "easy",
  },
  {
    id: 3,
    name: "Neem",
    short: "Azadirachta indica",
    image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png",
    benefits: ["Antibacterial", "Skin care"],
    difficulty: "medium",
  },
  {
    id: 4,
    name: "Giloy",
    short: "Tinospora cordifolia",
    image: "/lovable-uploads/b3353135-a7cc-4a7f-861d-ffbce405151c.png",
    benefits: ["Immunity", "Detox"],
    difficulty: "medium",
  },
];

export default function HerbalJourney() {
  const [currentStage, setCurrentStage] = useState(0); // 0 = intro, 1 = forest path, 2 = encounter
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [collected, setCollected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  useEffect(() => {
    // If you want to load saved progress, call your API here
    // fetch("/api/journey/load")...
  }, []);

  const handleStart = () => {
    setCurrentStage(1);
    setStoryProgress(10);
  };

  const handlePick = (p: Plant) => {
    setSelectedPlant(p);
    setCurrentStage(2);
    setStoryProgress((s) => Math.min(100, s + 20));
  };

  const handleCollect = (id: number) => {
    if (!collected.includes(id)) {
      setCollected([...collected, id]);
      setScore((s) => s + 10);
      setShowQuiz(true);
      // optional: send progress to API
      saveProgress({ collected: [...collected, id], score: score + 10 });
    }
  };

  const saveProgress = async (payload: any) => {
    try {
      await fetch("/api/journey/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Could not save progress:", err);
    }
  };

  return (
    <div className="min-h-screen bg-herbal-100 text-forest-900">
      <GlobalNavigation />
      <main className="pt-24 container mx-auto px-6 max-w-7xl">
        <AnimatePresence mode="popLayout">
          {currentStage === 0 && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg p-8 shadow-xl bg-herbal-50 grid md:grid-cols-2 gap-8 items-center"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  Herbal Forest Journey
                </h1>
                <p className="mt-4 text-lg text-forest-700">
                  A gentle interactive tour through AyurVista’s medicinal plants.
                  Choose your path, discover plant secrets and earn badges.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button onClick={handleStart} className="bg-forest-800 text-white">
                    Start the Journey
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStoryProgress(100);
                      setCurrentStage(1);
                    }}
                  >
                    Quick Explore
                  </Button>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full p-2 bg-forest-900 text-herbal-50">
                      <Leaf size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-forest-600">Mode</div>
                      <div className="font-semibold">Herbal Forest Journey — Easy</div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
              >
                <div className="absolute inset-0 bg-forest-gradient" />
                <div className="relative z-10 p-6 text-herbal-50">
                  <h3 className="text-xl font-semibold">Your forest map</h3>
                  <p className="mt-2 text-sm">Follow the glowing path, tap a plant to interact.</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {SEED_PLANTS.map((p) => (
                      <div key={p.id} className="bg-herbal-200/30 rounded p-2 flex gap-2 items-center">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                        <div className="text-sm">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs">{p.short}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}

          {currentStage >= 1 && (
            <motion.section
              key="path"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 grid lg:grid-cols-3 gap-6"
            >
              {/* Left — map & path */}
              <motion.div
                layout
                className="col-span-2 rounded-lg p-6 bg-white/50 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Forest Path</h2>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-forest-600">Progress</div>
                    <div className="w-48 bg-herbal-200 rounded h-2 overflow-hidden">
                      <div
                        className="h-full bg-forest-800 transition-all"
                        style={{ width: `${storyProgress}%` }}
                      />
                    </div>
                    <Badge className="bg-forest-900 text-herbal-50">{score} pts</Badge>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  {SEED_PLANTS.map((p, idx) => (
                    <motion.article
                      key={p.id}
                      whileHover={{ scale: 1.03, y: -6 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      layout
                      className="bg-white rounded-lg p-4 shadow-sm cursor-pointer"
                      onClick={() => handlePick(p)}
                    >
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded" />
                        <div>
                          <h3 className="font-semibold">{p.name}</h3>
                          <p className="text-sm text-forest-600">{p.short}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="px-2 py-1 text-xs rounded bg-herbal-100">{p.difficulty}</span>
                            <span className="px-2 py-1 text-xs rounded bg-herbal-100">{p.benefits[0]}</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>

              {/* Right sidebar */}
              <motion.aside
                layout
                className="rounded-lg p-4 bg-white/50 shadow-lg sticky top-28 h-fit"
              >
                <h4 className="font-semibold">Your Kit</h4>
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-forest-600">Collected</div>
                  {collected.length === 0 ? (
                    <div className="text-xs text-forest-500">No plants yet — explore the path</div>
                  ) : (
                    collected.map((id) => {
                      const p = SEED_PLANTS.find((x) => x.id === id)!;
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <img src={p.image} className="w-10 h-10 rounded" />
                          <div className="text-sm">{p.name}</div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => setShowQuiz(true)}
                    className="w-full bg-forest-800 text-white"
                  >
                    Take a Quick Quiz
                  </Button>
                </div>

                <div className="mt-4 text-xs text-forest-600">
                  Tip: Tap plants, collect them and complete story challenges to earn badges.
                </div>
              </motion.aside>
            </motion.section>
          )}

          {/* Plant encounter modal */}
          <AnimatePresence>
            {selectedPlant && (
              <motion.div
                key="encounter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ y: 30, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="max-w-3xl w-full bg-white rounded-lg shadow-2xl p-6 relative"
                >
                  <button
                    onClick={() => setSelectedPlant(null)}
                    className="absolute right-3 top-3 text-forest-500"
                  >
                    ✕
                  </button>

                  <div className="flex gap-6">
                    <img src={selectedPlant.image} className="w-36 h-36 rounded object-cover" />
                    <div>
                      <h3 className="text-2xl font-bold">{selectedPlant.name}</h3>
                      <p className="text-forest-600 mt-2">{selectedPlant.short}</p>

                      <div className="mt-4">
                        <h4 className="font-semibold">Medicinal benefits</h4>
                        <ul className="list-disc ml-5 mt-2 text-sm text-forest-700">
                          {selectedPlant.benefits.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Button onClick={() => handleCollect(selectedPlant.id)} className="bg-forest-800 text-white">
                          Collect (Earn +10)
                        </Button>
                        <Button variant="outline" onClick={() => { setShowQuiz(true); }}>
                          Learn More & Quiz
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quiz Modal */}
          <AnimatePresence>
            {showQuiz && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="max-w-xl w-full bg-white rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold">Quick Quiz</h3>
                  <p className="mt-2 text-sm text-forest-600">Answer to earn bonus points.</p>

                  <div className="mt-4">
                    {/* simple static quiz for demo */}
                    <div className="text-sm">Q: Which plant is best for skin soothing?</div>
                    <div className="flex gap-3 mt-4">
                      <Button onClick={() => { setScore(s => s + 5); setShowQuiz(false); }}>
                        Aloe Vera
                      </Button>
                      <Button variant="outline" onClick={() => setShowQuiz(false)}>Tulsi</Button>
                      <Button variant="outline" onClick={() => setShowQuiz(false)}>Neem</Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatePresence>
      </main>
    </div>
  );
}
