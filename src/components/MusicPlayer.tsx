import { Music, Music4 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MusicPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function MusicPlayer({ isPlaying, setIsPlaying }: MusicPlayerProps) {
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        id="btn-music-toggle"
        className="relative w-12 h-12 rounded-full backdrop-glass flex items-center justify-center shadow-lg border border-white/20 text-stone-200 focus:outline-none cursor-pointer"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Music4 className="w-4 h-4 text-white animate-pulse" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <Music className="w-5 h-5 text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative rotating border outer ring */}
        {isPlaying && (
          <span className="absolute inset-0 border border-dashed border-white/40 rounded-full animate-[spin_10s_linear_infinite]" />
        )}
      </motion.button>
    </div>
  );
}

