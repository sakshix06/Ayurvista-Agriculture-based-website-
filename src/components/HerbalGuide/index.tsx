import { useState, Component, ErrorInfo, ReactNode, useCallback } from 'react';
import GuideAvatar from './GuideAvatar';
import GuideVoice from './GuideVoice';
import GuideNavigation from './GuideNavigation';
import { useGuideStory } from './GuideStory';
import GuideHighlighter from './GuideHighlighter';
import './herbal-guide.css';

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

interface HerbalGuideProps {
  plants: PlantData[];
}

// Error Boundary Component
class HerbalGuideErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HerbalGuide Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg px-4 py-2 shadow-lg z-50">
          <p className="text-sm text-red-700 dark:text-red-300">
            Herbal Guide Error: {this.state.error?.message || 'Unknown error'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const HerbalGuideComponent = ({ plants }: HerbalGuideProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPlant, setCurrentPlant] = useState<PlantData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safety check: if no plants, don't render anything
  if (!plants || plants.length === 0) {
    return null;
  }

  // Memoize callbacks to prevent infinite loops
  const handlePlantChange = useCallback((plant: PlantData, index: number) => {
    setCurrentPlant(plant);
    setIsLoading(true);
    setError(null);
  }, []);

  const handleTourComplete = useCallback(() => {
    setIsActive(false);
    setCurrentPlant(null);
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const handleNarrationStart = useCallback(() => {
    setIsSpeaking(true);
    setIsLoading(false);
  }, []);

  const handleNarrationEnd = useCallback(() => {
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const handleNarrationError = useCallback((err: string) => {
    setError(err);
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const story = useGuideStory({
    plants,
    isActive,
    onPlantChange: handlePlantChange,
    onTourComplete: handleTourComplete,
    onNarrationStart: handleNarrationStart,
    onNarrationEnd: handleNarrationEnd,
    onNarrationError: handleNarrationError,
  });

  const handleStart = () => {
    setIsActive(true);
    story.handleStart();
  };

  const handleExit = () => {
    story.handleExit();
  };

  // Background ambience audio (optional - can be added later)
  // For now, we'll just add visual effects

  return (
    <>
      {/* Background Ambience Effect */}
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/30" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      )}

      {/* Guide Avatar */}
      <GuideAvatar
        isActive={isActive}
        isSpeaking={isSpeaking}
        position={{ x: 80, y: 80 }}
      />

      {/* Guide Voice */}
      {isActive && currentPlant && (
        <GuideVoice
          plant={currentPlant}
          isActive={isActive && story.isPlaying}
          isMuted={story.isMuted}
          onNarrationStart={story.handleNarrationStart}
          onNarrationEnd={story.handleNarrationEnd}
          onNarrationError={story.handleNarrationError}
        />
      )}

      {/* Guide Highlighter */}
      <GuideHighlighter
        plantId={currentPlant?.id || null}
        isActive={isActive}
      />

      {/* Guide Navigation */}
      <GuideNavigation
        isActive={isActive}
        isPlaying={story.isPlaying}
        isLoading={story.isLoading || isLoading}
        currentIndex={story.currentIndex}
        totalPlants={plants.length}
        onStart={handleStart}
        onStop={story.handleStop}
        onNext={story.handleNext}
        onPrevious={story.handlePrevious}
        onContinue={story.handleContinue}
        onExit={handleExit}
        onToggleMute={story.handleToggleMute}
        isMuted={story.isMuted}
      />

      {/* Error Display */}
      {error && isActive && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </>
  );
};

// Export with Error Boundary
export const HerbalGuide = ({ plants }: HerbalGuideProps) => {
  return (
    <HerbalGuideErrorBoundary>
      <HerbalGuideComponent plants={plants} />
    </HerbalGuideErrorBoundary>
  );
};

export default HerbalGuide;

