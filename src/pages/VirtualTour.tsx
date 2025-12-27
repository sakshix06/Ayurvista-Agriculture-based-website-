import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./virtual-tour.css";

const scenes = [
  { id: 1, image: "/lovable-uploads/forest1.png", text: ["Pause.", "Breathe."] },
  { id: 2, image: "/lovable-uploads/forest2.png", text: ["Tulsi — Guardian of Breath", "Neem — Purifier"] },
  { id: 3, image: "/lovable-uploads/forest3.png", text: ["Healing existed", "before language."] },
  { id: 4, image: "/lovable-uploads/forest4.png", text: ["Nature heals", "in cycles."] },
  { id: 5, image: "/lovable-uploads/forest5.png", text: ["The journey continues."] }
];

const VirtualTour = () => {
  const location = useLocation();

  // 🚫 HARD BLOCK — if not on /virtual-tour, render NOTHING
  if (location.pathname !== "/virtual-tour") {
    return null;
  }

  const [sceneIndex, setSceneIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // Body class ONLY when tour is active
  useEffect(() => {
    document.body.classList.add("vt-active");
    return () => {
      document.body.classList.remove("vt-active");
    };
  }, []);

  // Scene auto-play
  useEffect(() => {
    if (!started) return;
    if (sceneIndex < scenes.length - 1) {
      const timer = setTimeout(() => {
        setSceneIndex((prev) => prev + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sceneIndex, started]);

  const startJourney = () => {
    setStarted(true);
    audioRef.current?.play();
  };

  return (
    <div className="vt-wrapper">
      <audio ref={audioRef} src="/audio/welcome.mp3" preload="auto" />

      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
          <h1 className="text-4xl mb-6 font-light scene-text">
            Welcome to Ayurvista
          </h1>
          <button
            onClick={startJourney}
            className="px-8 py-3 border border-white/60 hover:bg-white hover:text-black transition"
          >
            Start Journey
          </button>
        </div>
      )}

      {started && (
        <>
          <img
            src={scenes[sceneIndex].image}
            className="absolute inset-0 w-full h-full object-cover scene-fade vt-zoom"
            alt="scene"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="vt-leaves">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="leaf" />
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            {scenes[sceneIndex].text.map((line, i) => (
              <h1
                key={i}
                className="text-3xl md:text-5xl font-light scene-text"
                style={{ animationDelay: `${i * 1.5}s` }}
              >
                {line}
              </h1>
            ))}

            {sceneIndex === scenes.length - 1 && (
              <button
                onClick={() => navigate("/")}
                className="mt-10 px-6 py-3 border border-white/60 hover:bg-white hover:text-black transition"
              >
                Exit Journey
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VirtualTour;
