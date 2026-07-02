import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Calendar, Heart } from "lucide-react";
import introVideo from "../assets/Ubah_jadi_warna_hijau_itu_ka.mp4";

export default function EventDetails() {
  const [showContent, setShowContent] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Countdown state
  const targetDate = new Date("2027-01-14T08:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Handle adding event to calendar (Save the date action)
  const handleSaveTheDate = () => {
    // Generate .ics calendar event content
    const title = "Pernikahan Puguh & Tiyah";
    const description = "Hari bahagia pernikahan Puguh & Tiyah. Mohon doa restu Anda.";
    const location = "Dusun Keng Keng, Desa Talesan, Wonogiri";
    const startDate = "20270114T080000";
    const endDate = "20270114T140000";

    const icsContent = 
      "BEGIN:VCALENDAR\n" +
      "VERSION:2.0\n" +
      "BEGIN:VEVENT\n" +
      `SUMMARY:${title}\n` +
      `DESCRIPTION:${description}\n` +
      `LOCATION:${location}\n` +
      `DTSTART:${startDate}\n` +
      `DTEND:${endDate}\n` +
      "END:VEVENT\n" +
      "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Pernikahan_Puguh_Tiyah.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewportEnter = () => {
    if (hasTriggered) return;
    setHasTriggered(true);

    const video = videoRef.current;
    if (!video) {
      setShowContent(true);
      return;
    }

    video.currentTime = 3;
    video.pause();

    const reverseStartTime = Date.now();

    const reverseInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - reverseStartTime;

      if (elapsed >= 3000) {
        clearInterval(reverseInterval);
        
        video.play().catch(() => {});
        setShowContent(true);
      } else {
        video.currentTime = Math.max(0, 3 - (elapsed / 1000));
      }
    }, 50);
  };

  return (
    <motion.section
      onViewportEnter={handleViewportEnter}
      viewport={{ amount: 0.1 }}
      className="scroll-section relative flex flex-col items-center justify-between text-white bg-transparent px-8 py-14 overflow-hidden min-h-screen"
      id="section-details"
    >
      {/* Local Background Video for Reverse Effect */}
      <div className="absolute inset-0 z-0 bg-[#1a2e23]">
        <video
          ref={videoRef}
          src={introVideo}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Green Filter over the background video */}
      <div className={`absolute inset-0 bg-[#2c4033]/60 mix-blend-multiply pointer-events-none z-10 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute inset-0 bg-[#3c4e3f]/60 pointer-events-none z-10 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`} />

      <div className="pt-6 relative z-20" />

      {/* Main layout matching reference image EXACTLY */}
      <div className="relative z-20 flex-1 flex flex-col justify-start items-center text-center max-w-sm md:max-w-md w-full py-2 min-h-[400px]">
        {showContent && (
          <>
            {/* Large Date Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full mb-3"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-white leading-tight uppercase">
                KAMIS, 14 JANUARI 2027
              </h2>
              <div className="w-full h-[1px] bg-white/20 mt-3" />
            </motion.div>

            {/* Combined Location Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="w-full text-center mb-4"
            >
              <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-stone-300 font-semibold block mb-0.5">
                LOKASI ACARA
              </span>
              <p className="font-serif text-base text-white tracking-wide leading-snug">
                KEDIAMAN MEMPELAI WANITA
              </p>
              <p className="font-sans text-[10px] text-gray-400 font-light max-w-xs mx-auto leading-normal mt-0.5 uppercase">
                DUSUN KENG KENG RT 004 RW 001 DESA TALESAN KEC. PURWANTORO, WONOGIRI
              </p>
            </motion.div>

            {/* Two Events side by side in a clean layout */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="grid grid-cols-2 gap-4 w-full text-center border-t border-b border-white/10 py-3 mb-4"
            >
              {/* Akad */}
              <div className="border-r border-white/10 pr-2">
                <span className="font-sans text-[8px] uppercase tracking-[0.15em] text-stone-300 font-medium block">
                  AKAD
                </span>
                <h4 className="font-serif text-sm font-light text-white tracking-wide uppercase mt-0.5">
                  NIKAH
                </h4>
                <p className="font-sans text-[10px] text-gray-300 mt-0.5 font-light">
                  08.00 - 10.00 WIB
                </p>
              </div>

              {/* Resepsi */}
              <div className="pl-2">
                <span className="font-sans text-[8px] uppercase tracking-[0.15em] text-stone-300 font-medium block">
                  RESEPSI
                </span>
                <h4 className="font-serif text-sm font-light text-white tracking-wide uppercase mt-0.5">
                  PERNIKAHAN
                </h4>
                <p className="font-sans text-[10px] text-gray-300 mt-0.5 font-light">
                  08.00 - 10.00 WIB
                </p>
              </div>
            </motion.div>

            {/* Single Maps Button at the bottom center */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="w-full flex justify-center mb-10"
            >
              <a
                href="https://maps.google.com/?q=Talesan+Purwantoro+Wonogiri"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center justify-center px-6 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[9px] tracking-widest font-sans uppercase rounded-md transition-all cursor-pointer"
              >
                Petunjuk Arah (Google Maps)
              </a>
            </motion.div>

            {/* Countdown Timer Block - Styled as elegant translucent card boxes */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="flex items-center justify-center gap-3 w-full max-w-xs mb-8 mt-4"
            >
              {[
                { label: "Hari", val: timeLeft.days },
                { label: "Jam", val: timeLeft.hours },
                { label: "Menit", val: timeLeft.minutes },
                { label: "Detik", val: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-black/45 backdrop-blur-md border border-white/15 px-3 py-4 rounded-xl flex flex-col justify-center items-center shadow-lg"
                >
                  <span className="font-sans text-xl md:text-2xl font-light text-white block tracking-tight">
                    {String(item.val).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-wider text-gray-400 mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* SAVE THE DATE Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="w-full flex justify-center mb-8"
            >
              <button
                onClick={handleSaveTheDate}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-white hover:bg-white hover:text-stone-950 transition-all duration-300 font-sans text-[10px] tracking-widest uppercase font-medium rounded-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>SAVE THE DATE →</span>
              </button>
            </motion.div>
          </>
        )}
      </div>

    </motion.section>
  );
}

