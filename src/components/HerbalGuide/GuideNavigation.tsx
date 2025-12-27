import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Volume2,
  VolumeX 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideNavigationProps {
  isActive: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  currentIndex: number;
  totalPlants: number;
  onStart: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onContinue: () => void;
  onExit: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export const GuideNavigation = ({
  isActive,
  isPlaying,
  isLoading,
  currentIndex,
  totalPlants,
  onStart,
  onStop,
  onNext,
  onPrevious,
  onContinue,
  onExit,
  onToggleMute,
  isMuted,
}: GuideNavigationProps) => {
  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <Button
          onClick={onStart}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl px-6 py-3 text-lg font-semibold rounded-full"
          size="lg"
        >
          <Play className="h-5 w-5 mr-2" />
          🌿 Start Herbal Guided Tour
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-200 dark:border-green-800 p-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-3 gap-2">
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              Plant {currentIndex + 1} of {totalPlants}
            </span>
            <div className="flex gap-1">
              {[...Array(totalPlants)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === currentIndex
                      ? 'bg-green-600 w-6'
                      : i < currentIndex
                      ? 'bg-green-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onPrevious}
              disabled={currentIndex === 0 || isLoading}
              variant="outline"
              size="sm"
              className="border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={isPlaying ? onStop : onContinue}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={onNext}
              disabled={currentIndex === totalPlants - 1 || isLoading}
              variant="outline"
              size="sm"
              className="border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            <Button
              onClick={onToggleMute}
              variant="ghost"
              size="sm"
              className="hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-gray-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-green-600" />
              )}
            </Button>

            <Button
              onClick={onExit}
              variant="ghost"
              size="sm"
              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuideNavigation;

