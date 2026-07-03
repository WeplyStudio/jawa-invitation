import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Heart, Download } from "lucide-react";
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";
import img3 from "../assets/image3.png";
import img4 from "../assets/image4.png";
import img5 from "../assets/image5.png";

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    url: img1,
    caption: "Cinta Terpatri dalam Keheningan",
  },
  {
    id: 2,
    url: img2,
    caption: "Langkah Bersama Menuju Masa Depan",
  },
  {
    id: 3,
    url: img3,
    caption: "Senyuman Terindah di Hari Bahagia",
  },
  {
    id: 4,
    url: img4,
    caption: "Dua Jiwa Satu Tujuan",
  },
  {
    id: 5,
    url: img5,
    caption: "Saling Melengkapi Selamanya",
  },
];

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = galleryImages[currentIndex].url;
    link.download = `photo_${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const transitionVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.05,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any, // easeOutExpo
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.95,
      x: dir < 0 ? 40 : -40,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    }),
  };

  return (
    <section 
      className="scroll-section relative text-white bg-stone-950" 
      id="section-gallery"
    >
      {/* Absolute Wrapper for Full-Screen Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {/* Animated sliding images filling the entire container */}
        <div className="absolute inset-0 w-full h-full z-0">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={transitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={galleryImages[currentIndex].url}
                alt={galleryImages[currentIndex].caption}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Left Edge Thin Navigation Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white/65 hover:text-white transition-all cursor-pointer group"
          aria-label="Previous image"
        >
          <ChevronLeft strokeWidth={1} className="w-10 h-10 transition-transform group-hover:-translate-x-1" />
        </button>

        {/* Right Edge Thin Navigation Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center text-white/65 hover:text-white transition-all cursor-pointer group"
          aria-label="Next image"
        >
          <ChevronRight strokeWidth={1} className="w-10 h-10 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Click anywhere on the overlay to open Lightbox (Z-index 20, behind navigation Z-index 30) */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 z-20 cursor-pointer"
          title="Klik untuk memperbesar"
        />
      </div>

      {/* Elegant Full-screen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-2 z-50">
              <button
                onClick={handleDownload}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-50"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-50"
              title="Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Big Zoomed Image Frame */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col bg-stone-900 border border-white/10 shadow-2xl"
            >
              <img
                src={galleryImages[currentIndex].url}
                alt={galleryImages[currentIndex].caption}
                className="w-auto h-auto max-w-full max-h-[72vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
              
              {/* Lightbox Caption Bar */}
              <div className="bg-black p-4 text-center border-t border-white/5">
                <p className="font-serif italic text-base text-stone-300">
                  {galleryImages[currentIndex].caption}
                </p>
                <p className="font-sans text-[10px] text-gray-500 uppercase tracking-[0.15em] mt-1">
                  Momen {currentIndex + 1} dari {galleryImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
