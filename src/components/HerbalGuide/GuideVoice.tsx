import { useState, useRef, useEffect } from 'react';

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

interface GuideVoiceProps {
  plant: PlantData | null;
  isActive: boolean;
  isMuted?: boolean;
  onNarrationStart: () => void;
  onNarrationEnd: () => void;
  onNarrationError: (error: string) => void;
}

export const GuideVoice = ({ 
  plant, 
  isActive,
  isMuted = false,
  onNarrationStart, 
  onNarrationEnd,
  onNarrationError 
}: GuideVoiceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [narrationText, setNarrationText] = useState<string>('');
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (utteranceRef.current) {
        synthRef.current?.cancel();
      }
    };
  }, []);

  // Reset narration text when plant changes
  useEffect(() => {
    if (plant) {
      setNarrationText('');
      // Cancel any ongoing speech when plant changes
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    }
  }, [plant?.id]);

  useEffect(() => {
    if (isActive && plant) {
      // Generate and speak when active
      generateAndSpeak(plant);
    } else {
      stopNarration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, plant?.id]);

  const generateNarration = async (plantData: PlantData): Promise<string> => {
    try {
      const response = await fetch('/api/ai/herbal-narration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantName: plantData.name,
          uses: plantData.uses,
          origin: 'प्राचीन भारत',
          benefits: plantData.uses,
          category: 'आयुर्वेदिक',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate narration');
      }

      const data = await response.json();
      return data.narration || `${plantData.name} के बारे में जानकारी।`;
    } catch (error) {
      console.error('Error generating narration:', error);
      throw error;
    }
  };

  const speakHindi = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a Hindi voice
    const voices = synthRef.current.getVoices();
    const hindiVoice = voices.find(
      (voice) => voice.lang.startsWith('hi') || voice.name.includes('Hindi')
    );
    
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    } else {
      // Fallback to any available voice
      const defaultVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
    }

    utterance.onstart = () => {
      if (!isMuted) {
        onNarrationStart();
      }
    };

    utterance.onend = () => {
      onNarrationEnd();
      utteranceRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      onNarrationError('Speech synthesis failed');
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    if (!isMuted) {
      synthRef.current.speak(utterance);
    } else {
      // If muted, just trigger the end callback after estimated duration
      const estimatedDuration = text.length * 100; // Rough estimate: 100ms per character
      setTimeout(() => {
        onNarrationEnd();
      }, estimatedDuration);
    }
  };

  const generateAndSpeak = async (plantData: PlantData) => {
    setIsLoading(true);
    
    try {
      const narration = await generateNarration(plantData);
      setNarrationText(narration);
      setIsLoading(false);
      
      // Wait a bit for voices to load, then speak
      if (synthRef.current) {
        const loadVoices = () => {
          const voices = synthRef.current?.getVoices() || [];
          if (voices.length > 0) {
            onNarrationStart();
            speakHindi(narration);
          } else {
            setTimeout(loadVoices, 100);
          }
        };
        loadVoices();
      } else {
        onNarrationError('Speech synthesis not available');
      }
    } catch (error) {
      setIsLoading(false);
      onNarrationError(error instanceof Error ? error.message : 'Failed to generate narration');
    }
  };

  const stopNarration = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }
    setIsLoading(false);
  };

  // Load voices when component mounts
  useEffect(() => {
    if (synthRef.current) {
      const loadVoices = () => {
        synthRef.current?.getVoices();
      };
      loadVoices();
      synthRef.current.addEventListener('voiceschanged', loadVoices);
      return () => {
        synthRef.current?.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default GuideVoice;

