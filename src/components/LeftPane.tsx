import { motion, AnimatePresence } from "motion/react";

interface LeftPaneProps {
  activeSection: string;
}

const sectionMedia: Record<string, { image: string; title: string; num: string; subtitle: string }> = {
  hero: {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
    title: "Puguh & Munti",
    subtitle: "PERNIKAHAN IMPIAN",
    num: "01 / 11",
  },
  quote: {
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1600",
    title: "Kutipan Suci",
    subtitle: "KUTIPAN AYAT SUCI",
    num: "02 / 11",
  },
  groom: {
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
    title: "Puguh Budi Utanto",
    subtitle: "MEMPELAI PRIA",
    num: "03 / 11",
  },
  bride: {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    title: "Munti Tiyah Rahayu",
    subtitle: "MEMPELAI WANITA",
    num: "04 / 11",
  },
  journey: {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    title: "Kisah Cinta Kami",
    subtitle: "KISAH PERJALANAN CINTA KAMI",
    num: "05 / 11",
  },
  details: {
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1600",
    title: "Waktu & Tempat",
    subtitle: "AKAD PERNIKAHAN SUCI",
    num: "06 / 11",
  },
  gallery: {
    image: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1600",
    title: "Momen Indah I",
    subtitle: "MEMORI PREWEDDING I",
    num: "07 / 11",
  },
  "gallery-grid": {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
    title: "Momen Indah II",
    subtitle: "MEMORI PREWEDDING II",
    num: "08 / 11",
  },
  rsvp: {
    image: "https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=1600",
    title: "Kehadiran Anda",
    subtitle: "DOA RESTU & CINTA",
    num: "09 / 11",
  },
  gift: {
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1600",
    title: "Kado Pernikahan",
    subtitle: "KIRIM KADO DIGITAL",
    num: "10 / 11",
  },
  thankyou: {
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1600",
    title: "Terima Kasih",
    subtitle: "TERIMA KASIH ATAS KEHADIRAN & DUKUNGAN",
    num: "11 / 11",
  },
};

export default function LeftPane({ activeSection }: LeftPaneProps) {
  const current = sectionMedia[activeSection] || sectionMedia.hero;

  return (
    <div className="hidden md:block w-2/3 h-screen relative overflow-hidden select-none">
      {/* Static Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(26, 46, 35, 0.5), rgba(26, 46, 35, 0.8)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600')`,
        }}
      />

      {/* Slide Index Counter (e.g. 01 / 04) - Matches User Image layout exactly */}
      <div className="absolute top-8 left-8 z-10">
        <motion.span
          key={`num-${activeSection}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif italic text-stone-300 text-sm tracking-widest block"
        >
          {current.num}
        </motion.span>
      </div>

      {/* Left Bottom Narrative HUD (Text Details) */}
      <div className="absolute bottom-12 left-12 z-10 max-w-md text-white">
        <motion.p
          key={`sub-${activeSection}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-[10px] tracking-[0.3em] uppercase text-stone-300 font-semibold mb-2"
        >
          {current.subtitle}
        </motion.p>
        
        <motion.h3
          key={`title-${activeSection}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-3xl font-light tracking-wide text-white"
        >
          {current.title}
        </motion.h3>

        <div className="w-8 h-[1px] bg-white/30 my-4" />

        <p className="font-sans text-[11px] text-gray-300/80 tracking-wide font-light leading-relaxed">
          Saksikan penyatuan janji suci cinta abadi Puguh &amp; Munti. Kebersamaan Anda adalah doa restu terindah bagi kami.
        </p>
      </div>

      {/* Floating elegant floral line monogram */}
      <div className="absolute top-8 right-8 z-10 font-serif italic text-lg text-stone-300/80 tracking-[0.2em]">
        P &amp; M
      </div>
    </div>
  );
}
