import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GuideHighlighterProps {
  plantId: number | null;
  isActive: boolean;
}

interface CardPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const GuideHighlighter = ({ plantId, isActive }: GuideHighlighterProps) => {
  const [cardPosition, setCardPosition] = useState<CardPosition | null>(null);

  useEffect(() => {
    if (plantId && isActive) {
      // Find the card element by plant ID
      const card = document.querySelector(`[data-plant-id="${plantId}"]`) as HTMLElement;
      if (card) {
        // Scroll into view smoothly
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });

        // Add highlight class
        card.classList.add('herbal-guide-active');

        // Update position after a brief delay to ensure layout is stable
        const updatePosition = () => {
          const rect = card.getBoundingClientRect();
          setCardPosition({
            left: rect.left - 8,
            top: rect.top - 8 + window.scrollY,
            width: rect.width + 16,
            height: rect.height + 16,
          });
        };

        // Initial update
        setTimeout(updatePosition, 100);

        // Update on scroll/resize
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);

        return () => {
          card.classList.remove('herbal-guide-active');
          window.removeEventListener('scroll', updatePosition);
          window.removeEventListener('resize', updatePosition);
        };
      }
    } else {
      setCardPosition(null);
    }
  }, [plantId, isActive]);

  if (!plantId || !isActive || !cardPosition) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Overlay with spotlight effect */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Glowing outline around active card */}
      <motion.div
        className="absolute border-4 border-green-400 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.6)]"
        style={{
          left: cardPosition.left,
          top: cardPosition.top,
          width: cardPosition.width,
          height: cardPosition.height,
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(34,197,94,0.6)',
            '0 0 40px rgba(34,197,94,0.8)',
            '0 0 20px rgba(34,197,94,0.6)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default GuideHighlighter;

