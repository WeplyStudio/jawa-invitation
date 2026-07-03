import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import cover1 from "../assets/cover1.png";
import cover2 from "../assets/cover2.png";
import groomImg from "../assets/groom.jpg";
import brideImg from "../assets/bride.jpg";
import fanImage from "../assets/images/wedding_fan_1782982225373.jpg";
import g1 from "../assets/1000397447.png";
import g2 from "../assets/1000397450.png";
import g3 from "../assets/1000397451.png";
import g4 from "../assets/1000397452.png";
import g5 from "../assets/1000397477.png";
import g6 from "../assets/1000397527.png";
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";
import img3 from "../assets/image3.png";
import img4 from "../assets/image4.png";
import img5 from "../assets/image5.png";

interface CoverProps {
  onOpen: () => void;
  onStartAudio: () => void;
}

export default function Cover({ onOpen, onStartAudio }: CoverProps) {
  const [phase, setPhase] = useState<'splash' | 'cover' | 'fanOpening'>('splash');
  const [guestName, setGuestName] = useState("Nama Tamu");
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const guest = searchParams.get("name") || searchParams.get("to");
    if (guest) {
      setGuestName(guest);
    }
  }, []);

  // Preload all assets in parallel
  useEffect(() => {
    const assets = [
      cover1,
      cover2,
      groomImg,
      brideImg,
      fanImage,
      g1,
      g2,
      g3,
      g4,
      g5,
      g6,
      img1,
      img2,
      img3,
      img4,
      img5,
      "https://i.ibb.co.com/n8skQqjh/Desain-tanpa-judul-1.png",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000"
    ];

    let loadedCount = 0;
    const totalAssets = assets.length;

    if (totalAssets === 0) {
      setLoadingComplete(true);
      setLoadProgress(100);
      return;
    }

    const onAssetLoaded = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalAssets) * 100);
      setLoadProgress(percent);
      if (loadedCount >= totalAssets) {
        setLoadingComplete(true);
      }
    };

    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded; // Count error as loaded to prevent lockup
    });
  }, []);

  // Enforce a minimum display time for the beautiful splash screen (e.g. 2500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Change phase only when both the progress is done and the minimum time has elapsed
  useEffect(() => {
    if (minimumTimeElapsed && loadingComplete) {
      setPhase('cover');
    }
  }, [minimumTimeElapsed, loadingComplete]);

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
            className="absolute inset-0 bg-[#1a2e23] flex flex-col items-center justify-center z-50 px-6 gap-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.0, ease: "easeOut" }}
              className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.35em] text-stone-200 uppercase text-center font-light leading-relaxed"
            >
              Munti &amp; Puguh
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col items-center gap-3 w-full max-w-xs"
            >
              <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-stone-300 absolute left-0 top-0"
                  style={{ width: `${loadProgress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
              </div>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Memuat Undangan {loadProgress}%
              </span>
            </motion.div>
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
                MUNTI &amp; PUGUH
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
