import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import cover1 from "../assets/cover1.png";

interface CoverProps {
  onOpen: () => void;
  onStartAudio: () => void;
}

export default function Cover({ onOpen, onStartAudio }: CoverProps) {
  const [phase, setPhase] = useState<'splash' | 'cover' | 'fanOpening'>('splash');
  const [guestName, setGuestName] = useState("Nama Tamu");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const guest = searchParams.get("name") || searchParams.get("to");
    if (guest) {
      setGuestName(guest);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('cover');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === 'fanOpening') {
      const timer = setTimeout(() => {
        onOpen();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onOpen]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white overflow-hidden bg-[#1a2e23]"
    >
      <AnimatePresence mode="wait">
        {phase === 'splash' ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[#1a2e23] flex items-center justify-center z-50 px-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.0, ease: "easeOut" }}
              className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.35em] text-stone-200 uppercase text-center font-light leading-relaxed"
            >
              Tiyah &amp; Puguh
            </motion.h1>
          </motion.div>
        ) : phase === 'fanOpening' ? (
          <motion.div
            key="fanOpening"
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#1a2e23]"
          >
            <motion.div
              initial={{ x: 0, rotate: 0 }}
              animate={{ x: -150, rotate: -15 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute right-1/2"
            >
              <img src="https://i.ibb.co.com/n8skQqjh/Desain-tanpa-judul-1.png" alt="Fan Left" className="h-96 w-auto object-contain" />
            </motion.div>
            <motion.div
              initial={{ x: 0, rotate: 0 }}
              animate={{ x: 150, rotate: 15 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-1/2"
            >
              <img src="https://i.ibb.co.com/n8skQqjh/Desain-tanpa-judul-1.png" alt="Fan Right" className="h-96 w-auto object-contain" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-between w-full h-full"
          >
            {/* Background Image - newly generated B&W studio portrait */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.75)), url('${cover1}')`
              }}
            />

            {/* Top Text Block matching screenshot */}
            <div className="relative z-10 pt-16 flex flex-col items-center text-center px-4 w-full">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-stone-300 font-semibold mb-3"
              >
                KAMI MENGUNDANG ANDA UNTUK MERAYAKAN
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1.0 }}
                className="font-serif text-3xl md:text-5xl font-light tracking-widest text-white uppercase leading-tight"
              >
                TIYAH &amp; PUGUH
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8 }}
                className="font-serif italic text-xs md:text-sm text-stone-300 mt-2 tracking-wide font-light"
              >
                #sungGuhmencintaiMu
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.3, scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-12 h-[1px] bg-white my-4"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="font-sans text-[10px] md:text-xs tracking-[0.25em] uppercase text-stone-300 font-light"
              >
                KAMIS, 14 JANUARI 2027
              </motion.p>
            </div>

            {/* Bottom Content / RSVP / Let's Open Card area */}
            <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center px-6 pb-16">
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="font-signature text-4xl md:text-5xl text-stone-300 italic leading-none mb-1 select-none"
              >
                Kepada Yth.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="font-serif text-2xl md:text-3.5xl font-light text-white tracking-wide mb-2 select-none"
              >
                {guestName}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="font-sans text-[10px] md:text-xs text-stone-300 font-light mb-8 leading-relaxed max-w-[260px]"
              >
                Mohon maaf apabila ada kesalahan penulisan nama atau gelar
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onStartAudio();
                  setPhase('fanOpening');
                }}
                id="btn-buka-undangan"
                className="bg-white hover:bg-stone-200 text-stone-900 font-sans font-semibold text-[11px] tracking-[0.25em] px-10 py-4 rounded-sm shadow-2xl transition-all duration-300 cursor-pointer uppercase"
              >
                BUKA UNDANGAN
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
