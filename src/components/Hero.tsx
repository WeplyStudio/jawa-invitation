import { motion, AnimatePresence } from "motion/react";

export default function Hero({ videoFinished }: { videoFinished: boolean }) {

  return (
    <section className="scroll-section min-h-screen relative flex flex-col items-center justify-between text-white bg-transparent" id="section-hero">
      {/* Subtle Background pattern overlay - simplified for now */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Main Content */}
      <AnimatePresence>
        {videoFinished && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-between py-10"
          >
            <div className="text-center px-6 flex-1 flex flex-col justify-center items-center gap-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-sans text-[10px] uppercase tracking-[0.35em] text-stone-300 font-semibold"
              >
                THE WEDDING OF
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 1.0 }}
                className="font-serif text-5xl md:text-6xl font-light tracking-wide text-[#e8d7b3] leading-tight"
              >
                TIYAH &amp;
                <br />
                PUGUH
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex flex-col gap-1 font-sans text-xs tracking-[0.2em] uppercase text-stone-200 font-light"
              >
                <p>JANUARI 2027</p>
                <p>TALESAN, PURWANTORO, WONOGIRI</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-md mt-6"
              >
                <p className="font-serif italic text-sm text-stone-300 leading-relaxed">
                  "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)."
                </p>
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mt-2">
                  Adz-Dzariyat: 49
                </p>
              </motion.div>
            </div>

            {/* Dynamic Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center gap-1.5 select-none pointer-events-none"
            >
              <div className="w-5 h-8 rounded-full border-[1.5px] border-[#e8d7b3] flex justify-center pt-1.5 opacity-80">
                <motion.div
                  animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-1.5 rounded-full bg-[#e8d7b3]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
