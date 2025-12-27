import { useState, useEffect, useCallback } from 'react';

interface PlantData {
  id: number;
  name: string;
  scientificName: string;
  uses: string[];
  facts: string[];
  color: string;
  found: boolean;
  image: string;
}

interface GuideStoryProps {
  plants: PlantData[];
  isActive: boolean;
  onPlantChange: (plant: PlantData, index: number) => void;
  onTourComplete: () => void;
  onNarrationStart: () => void;
  onNarrationEnd: () => void;
  onNarrationError: (error: string) => void;
}

export const useGuideStory = ({
  plants,
  isActive,
  onPlantChange,
  onTourComplete,
  onNarrationStart,
  onNarrationEnd,
  onNarrationError,
}: GuideStoryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Reset when tour starts
  useEffect(() => {
    if (isActive) {
      setCurrentIndex(0);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isActive]);

  const handleNarrationStart = useCallback(() => {
    setIsPlaying(true);
    setIsLoading(false);
    onNarrationStart();
  }, [onNarrationStart]);

  const handleNarrationEnd = useCallback(() => {
    setIsPlaying(false);
    setIsLoading(false);
    onNarrationEnd();

    // Auto-advance to next plant
    if (currentIndex < plants.length - 1) {
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (plants[nextIndex]) {
          setCurrentIndex(nextIndex);
          setIsPlaying(true);
          setIsLoading(true);
          onPlantChange(plants[nextIndex], nextIndex);
        }
      }, 1000);
    } else {
      // Tour complete
      setTimeout(() => {
        onTourComplete();
      }, 2000);
    }
  }, [currentIndex, plants, onNarrationEnd, onTourComplete, onPlantChange]);

  const handleNarrationError = useCallback((error: string) => {
    setIsPlaying(false);
    setIsLoading(false);
    onNarrationError(error);
  }, [onNarrationError]);

  // Note: Plant change is triggered manually via handleStart, handleNext, handlePrevious, handleContinue
  // This ensures narration only starts when explicitly requested

  const handleStart = () => {
    if (plants.length > 0) {
      setCurrentIndex(0);
      setIsLoading(true);
      // Trigger plant change which will start narration
      setTimeout(() => {
        onPlantChange(plants[0], 0);
        setIsPlaying(true);
      }, 100);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsLoading(false);
    // Stop speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleNext = () => {
    if (currentIndex < plants.length - 1) {
      handleStop();
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
        setIsLoading(true);
        onPlantChange(plants[nextIndex], nextIndex);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleStop();
      setTimeout(() => {
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        setIsPlaying(true);
        setIsLoading(true);
        onPlantChange(plants[prevIndex], prevIndex);
      }, 300);
    }
  };

  const handleContinue = () => {
    if (!isPlaying && plants[currentIndex]) {
      setIsLoading(true);
      setIsPlaying(true);
      // Trigger narration for current plant
      setTimeout(() => {
        onPlantChange(plants[currentIndex], currentIndex);
      }, 100);
    }
  };

  const handleExit = () => {
    handleStop();
    onTourComplete();
  };

  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (window.speechSynthesis) {
      if (newMutedState) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
    }
  };

  return {
    currentIndex,
    isPlaying,
    isLoading,
    isMuted,
    currentPlant: plants[currentIndex] || null,
    handleStart,
    handleStop,
    handleNext,
    handlePrevious,
    handleContinue,
    handleExit,
    handleToggleMute,
    handleNarrationStart,
    handleNarrationEnd,
    handleNarrationError,
  };
};

