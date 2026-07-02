import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import introVideo from "./assets/Ubah_jadi_warna_hijau_itu_ka.mp4";
import Cover from "./components/Cover";
import MusicPlayer from "./components/MusicPlayer";
import LeftPane from "./components/LeftPane";
import Hero from "./components/Hero";
import Quote from "./components/Quote";
import Groom from "./components/Groom";
import Bride from "./components/Bride";
import LoveJourney from "./components/LoveJourney";
import EventDetails from "./components/EventDetails";
import Gallery from "./components/Gallery";
import RSVPAndWishes from "./components/RSVPAndWishes";
import GiftSection from "./components/GiftSection";
import ThankYou from "./components/ThankYou";

const backgroundMusicUrl = "https://inv.akaddigitech.id/wp-content/uploads/2025/09/Irenne-Ghea-Feat-Widhi-Arjuna-Sotya-Dangdut.mp3";

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(backgroundMusicUrl);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log("Audio play failed: ", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleStartAudio = () => {
    setIsPlaying(true);
  };

  // Handle invitation opening sequence
  const handleOpenInvitation = () => {
    setIsOpened(true);
  };

  // Monitor which section is in view to light up corresponding side dots
  useEffect(() => {
    if (!isOpened) return;

    const sections = ["hero", "quote", "groom", "bride", "journey", "details", "gallery", "rsvp", "gift", "thankyou"];
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      // Simple threshold calculation to match the snapped active section
      sections.forEach((id) => {
        const el = document.getElementById(`section-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= -windowHeight / 2 && rect.top < windowHeight / 2) {
            setActiveSection(id);
          }
        }
      });
    };

    // Set up native scroll listeners on the correct scrolling element
    // Inside desktop split screen, the scroll container is the `main` tag itself.
    // Inside mobile, it is also the `main` tag.
    const container = document.querySelector(".scroll-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpened]);

  // Smooth scroll programmatically to a specific section on dot click
  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="relative bg-[#1a2e23] text-gray-900 min-h-screen overflow-hidden selection:bg-stone-200 selection:text-stone-900">
      
      {/* 1. Introductory Envelope Cover Gate (Cinematic reveal) */}
      <AnimatePresence>
        {!isOpened && (
          <Cover onOpen={handleOpenInvitation} onStartAudio={handleStartAudio} />
        )}
      </AnimatePresence>

      {/* 2. Main Ambient Music Controller */}
      {isOpened && (
        <MusicPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      )}

      {/* 4. Elegant Top Floating Brand Bar */}
      <AnimatePresence>
        {isOpened && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="fixed top-0 left-0 right-0 z-30 flex justify-end items-center px-6 md:px-12 py-5 pointer-events-none select-none"
          >
            {/* Hamburger-style menu icon for overlay sidebar with two white lines */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="pointer-events-auto flex flex-col gap-1.5 p-3 cursor-pointer group active:scale-95 transition-transform"
              title="Menu"
            >
              <span className="w-6 h-[2px] bg-white block transition-all group-hover:bg-stone-300" />
              <span className="w-6 h-[2px] bg-white block transition-all group-hover:bg-stone-300" />
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* 5. Responsive Split-Screen Layout / Full Screen Layout */}
      {isOpened && (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
          {/* Left Column (Sticky Showcase - Desktop Only) */}
          <LeftPane activeSection={activeSection} />

          {/* Right Column Wrapper with Solid Background */}
          <div className="relative w-full md:w-1/3 h-screen bg-[#1a2e23] overflow-hidden">
            {/* Shared Fixed Video Background */}
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#1a2e23]">
              <video
                src={introVideo}
                autoPlay
                muted
                playsInline
                onEnded={() => setVideoFinished(true)}
                className="w-full h-full object-cover"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: videoFinished && (activeSection === 'hero' || activeSection === 'quote') ? 0.85 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-[#1a2e23] pointer-events-none"
              />
            </div>

            {/* Right Column Scrollable Sections */}
            <main className="scroll-container relative z-10 w-full h-full overflow-y-auto bg-transparent border-l border-white/5">
              <Hero videoFinished={videoFinished} />
              <Quote />
              <Groom />
              <Bride />
              <LoveJourney />
              <EventDetails />
              <Gallery />
              <RSVPAndWishes />
              <GiftSection />
              <ThankYou />
            </main>
          </div>
        </div>
      )}

      {/* 6. Beautiful Overlay Sidebar Menu Matching Screenshot */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#f5f2eb] text-[#2c2a29] flex items-center justify-center p-6 md:p-16 overflow-y-auto"
            onClick={() => setIsSidebarOpen(false)}
          >
            {/* Close Button at top right of the whole page */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-stone-800 hover:text-stone-500 transition-all cursor-pointer focus:outline-none z-50 p-2"
              title="Close Menu"
            >
              <X className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" />
            </button>

            {/* Content Container Split */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center justify-center max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Landscape photo of the couple (Desktop Only) */}
              <div className="hidden md:flex justify-end items-center">
                <div className="w-full max-w-[420px] aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000"
                    alt="Tiyah & Puguh"
                    className="w-full h-full object-cover grayscale brightness-95 hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Right Column: Menu Options */}
              <div className="flex flex-col items-start justify-center text-left w-full max-w-md">
                <div className="flex flex-col gap-4 w-full">
                  {[
                    { label: "Home", section: "hero" },
                    { label: "Profile", section: "groom" },
                    { label: "Love Story", section: "journey" },
                    { label: "Wedding Event", section: "details" },
                    { label: "RSVP", section: "rsvp" },
                    { label: "Wedding Gift", section: "gift" },
                    { label: "Gallery", section: "gallery" },
                  ].map((item, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        scrollToSection(item.section);
                        setIsSidebarOpen(false);
                      }}
                      whileHover={{ x: 12 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full text-left font-serif text-[36px] md:text-[44px] lg:text-[50px] font-light leading-tight text-stone-800 hover:text-stone-500 transition-colors cursor-pointer select-none"
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>

                {/* Small description at bottom */}
                <p className="font-sans text-[10px] md:text-xs leading-relaxed text-stone-400 font-light mt-8 max-w-xs select-none">
                  Please click one of the menu options above to navigate directly to your desired page.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
