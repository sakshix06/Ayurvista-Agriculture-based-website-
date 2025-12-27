import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

interface GuideAvatarProps {
  isActive: boolean;
  isSpeaking: boolean;
  position?: { x: number; y: number };
}

export const GuideAvatar = ({ 
  isActive, 
  isSpeaking,
  position = { x: 80, y: 80 }
}: GuideAvatarProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        bottom: `${position.y}px`,
        right: `${position.x}px`,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: isSpeaking ? [0, -10, 0] : 0,
      }}
      transition={{
        duration: 0.5,
        y: {
          duration: 1.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        },
      }}
    >
      {/* Avatar Container */}
      <div className="relative">
        {/* Glowing Background */}
        <motion.div
          className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-50"
          animate={{
            scale: isSpeaking ? [1, 1.2, 1] : 1,
            opacity: isSpeaking ? [0.5, 0.7, 0.5] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* Main Avatar Circle */}
        <motion.div
          className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/80"
          animate={{
            rotate: isSpeaking ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 3,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {/* Leaf Icon */}
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>

          {/* Blinking Eyes Effect */}
          {isSpeaking && (
            <motion.div
              className="absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-1"
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}

          {/* Sparkle Effects */}
          {isSpeaking && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: [
                      Math.cos((i * 120 * Math.PI) / 180) * 30,
                      Math.cos((i * 120 * Math.PI) / 180) * 50,
                    ],
                    y: [
                      Math.sin((i * 120 * Math.PI) / 180) * 30,
                      Math.sin((i * 120 * Math.PI) / 180) * 50,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        {/* Wave Animation */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 border-4 border-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.8, 0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        {/* Name Tag */}
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-gray-800/95 px-3 py-1 rounded-full shadow-lg border border-green-200 dark:border-green-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs font-semibold text-green-700 dark:text-green-300">
            🌿 आयुर्वेदिक गाइड
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GuideAvatar;

