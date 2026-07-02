import { motion } from "motion/react";
import { Phone, Instagram, Globe } from "lucide-react";

export default function ThankYou() {
  return (
    <section
      className="scroll-section relative flex flex-col items-center justify-between text-white bg-stone-950 px-8 py-14"
      id="section-thankyou"
    >
      {/* Background with beautiful couple traditional photo matching screenshot */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <img
          src="/src/assets/images/prewedding_video_cover_1782905459262.jpg"
          alt="Thank You Background"
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        {/* Subtle top & bottom shadow gradients for optimal text readability */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
      </div>

      {/* Top Page Count Indicator matching style of standard section */}
      <div className="relative z-10 font-sans text-xs tracking-[0.3em] text-white/80 font-light select-none shrink-0 mt-2">
        11 / 11
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-end items-center text-center max-w-sm md:max-w-md w-full pb-10 pt-24">
        
        {/* Header Block with elegant Serif Typography */}
        <div className="flex flex-col items-center select-none pointer-events-none">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="font-serif text-xl md:text-2xl font-normal tracking-[0.15em] text-white mb-5 leading-tight uppercase"
          >
            THANK YOU FOR
            <br />
            YOUR ATTENDANCE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-sans text-[10px] md:text-[11px] leading-relaxed text-stone-300 font-light max-w-[260px] mb-6 px-1"
          >
            It is a pleasure and honor for us, if you are willing to attend and give us your blessing.
          </motion.p>

          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-[11px] md:text-xs tracking-[0.4em] text-stone-300 font-normal uppercase"
          >
            TIYAH &amp; PUGUH
          </motion.span>
        </div>

      </div>

      {/* Footer / Contacts Branding match screenshot EXACTLY */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-2.5 text-center shrink-0 mt-6 pb-2 select-none">
        
        <div className="text-[9px] font-sans uppercase tracking-[0.2em] text-white/60 font-semibold">
          CREATED BY KRIG STUDIO
        </div>

        {/* Dynamic Horizontal Info items */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-sans text-white/85 tracking-wider">
          <a
            href="https://wa.me/6281327577133"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-stone-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-white/70" />
            <span>+62 813-2757-7133</span>
          </a>
          <a
            href="https://instagram.com/krigstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-stone-200 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-white/70" />
            <span>KRIG STUDIO</span>
          </a>
          <a
            href="https://krigstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-stone-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-white/70" />
            <span>KRIGSTUDIO.COM</span>
          </a>
        </div>

        {/* Copyright notice */}
        <div className="text-[9px] font-sans text-white/45 tracking-wide mt-1">
          &copy; All rights reserved by Krig Studio
        </div>

      </div>
    </section>
  );
}
