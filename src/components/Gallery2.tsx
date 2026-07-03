import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";

// Import the high quality images uploaded by the user
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

interface GalleryImage {
  src: string;
  caption: string;
}

// Master collection of 11 beautiful images for the full-screen viewer
const allGalleryImages: GalleryImage[] = [
  { src: g1, caption: "Kebahagiaan yang Abadi" },
  { src: g2, caption: "Tatapan Penuh Makna" },
  { src: g3, caption: "Melangkah Bersama" },
  { src: img1, caption: "Cinta Terpatri dalam Keheningan" },
  { src: img2, caption: "Langkah Bersama Menuju Masa Depan" },
  { src: img3, caption: "Senyuman Terindah di Hari Bahagia" },
  { src: img4, caption: "Dua Jiwa Satu Tujuan" },
  { src: img5, caption: "Saling Melengkapi Selamanya" },
  { src: g5, caption: "Janji Suci Pernikahan" },
  { src: g6, caption: "Cinta Sejati Kita" },
  { src: g4, caption: "Momen Indah Bersama" },
];

export default function Gallery2() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Define Carousel items (slots 4, 5, 6 from the pool of portrait images)
  const carouselImages = [
    { src: img1, caption: "Cinta Terpatri dalam Keheningan", originalIndex: 3 },
    { src: img2, caption: "Langkah Bersama Menuju Masa Depan", originalIndex: 4 },
    { src: img3, caption: "Senyuman Terindah di Hari Bahagia", originalIndex: 5 },
    { src: img4, caption: "Dua Jiwa Satu Tujuan", originalIndex: 6 },
    { src: img5, caption: "Saling Melengkapi Selamanya", originalIndex: 7 },
    { src: g5, caption: "Janji Suci Pernikahan", originalIndex: 8 },
    { src: g6, caption: "Cinta Sejati Kita", originalIndex: 9 },
  ];

  // Auto-slide logic for the 3 columns carousel row
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = carouselImages.length - 3; // exact bound to show 3 columns side-by-side
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % allGalleryImages.length);
  };

  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? allGalleryImages.length - 1 : prev - 1));
  };

  return (
    <section 
      className="scroll-section relative text-white py-4 px-3 bg-[#1a3020] flex flex-col justify-between items-center" 
      id="section-gallery-grid"
    >
      {/* Subtle Background Lighting for premium feel */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-black/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Page Count Indicator */}
      <div className="relative z-10 font-sans text-[9px] tracking-[0.3em] text-white/50 font-light select-none shrink-0 mt-0.5">
        08 / 11
      </div>

      {/* Core Responsive Content Container - set to an ultra-compact 250px width for a beautifully compact layout */}
      <div className="max-w-[250px] w-full mx-auto relative z-10 flex-1 flex flex-col justify-center gap-2">
        
        {/* elegant display header matching "Our Gallery" */}
        <div className="text-center mb-0.5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-0.5"
          >
            <h2 className="font-serif italic text-xl font-light text-[#f5f2eb] tracking-wide">
              Galeri Kami
            </h2>
            <div className="w-6 h-[1px] bg-[#f5f2eb]/20 mt-0.5" />
          </motion.div>
        </div>

        {/* ROW 1: Stacked Left Landscape + Tall Right Portrait (using items-stretch) */}
        <div className="grid grid-cols-12 gap-1 w-full items-stretch">
          
          {/* Left Column (Landscape Stack) */}
          <div className="col-span-7 flex flex-col gap-1">
            {/* Top Left Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onClick={() => openLightbox(0)}
              className="aspect-[4/3] rounded-[8px] overflow-hidden cursor-pointer relative group border border-white/10 shadow-sm"
            >
              <img
                src={g1}
                alt={allGalleryImages[0].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
            </motion.div>

            {/* Bottom Left Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              onClick={() => openLightbox(1)}
              className="aspect-[4/3] rounded-[8px] overflow-hidden cursor-pointer relative group border border-white/10 shadow-sm"
            >
              <img
                src={g2}
                alt={allGalleryImages[1].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
            </motion.div>
          </div>

          {/* Right Column (Elegant Tall Portrait) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => openLightbox(2)}
            className="col-span-5 rounded-[8px] overflow-hidden cursor-pointer relative group border border-white/10 shadow-sm"
          >
            <img
              src={g3}
              alt={allGalleryImages[2].caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
          </motion.div>

        </div>

        {/* ROW 2: Three Vertical Portrait columns side-by-side with smooth horizontal auto-slide */}
        <div className="relative overflow-hidden w-full py-0.5">
          <div 
            className="flex gap-1 transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * 33.333}%)` 
            }}
          >
            {carouselImages.map((item, idx) => (
              <div
                key={idx}
                className="w-[calc(33.333%-2.67px)] flex-shrink-0 aspect-[2/3] rounded-[8px] overflow-hidden cursor-pointer relative group border border-white/10 shadow-sm active:scale-98 transition-all"
                onClick={() => openLightbox(item.originalIndex)}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: Single gorgeous wide landscape image at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onClick={() => openLightbox(10)}
          className="w-full aspect-[16/9] rounded-[8px] overflow-hidden cursor-pointer relative group border border-white/10 shadow-sm"
        >
          <img
            src={g4}
            alt={allGalleryImages[10].caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            style={{ objectPosition: "center 30%" }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
        </motion.div>

      </div>

      {/* Slide & explore label at the bottom */}
      <div className="font-sans text-[9px] tracking-wider text-white/40 select-none mt-2 flex items-center gap-1">
        <Heart className="w-2.5 h-2.5 fill-white/30 text-transparent animate-pulse" />
        Ketuk foto untuk memperbesar
      </div>

      {/* Lightbox Viewer */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-50"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevLightbox}
              className="absolute left-4 md:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-50"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextLightbox}
              className="absolute right-4 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-50"
              title="Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Container with Bounce Animation */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col bg-stone-900 border border-white/10 shadow-2xl"
            >
              <img
                src={allGalleryImages[lightboxIndex].src}
                alt={allGalleryImages[lightboxIndex].caption}
                className="w-auto h-auto max-w-full max-h-[72vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
              
              {/* Caption Banner */}
              <div className="bg-black p-4 text-center border-t border-white/5">
                <p className="font-serif italic text-base text-stone-200">
                  {allGalleryImages[lightboxIndex].caption}
                </p>
                <p className="font-sans text-[10px] text-gray-500 uppercase tracking-[0.15em] mt-1">
                  Momen {lightboxIndex + 1} dari {allGalleryImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
