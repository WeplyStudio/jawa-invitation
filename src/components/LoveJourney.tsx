import { motion } from "motion/react";
import introVideo from "../assets/Ubah_warna_rumah_nya_jadi_warn.mp4";


export default function LoveJourney() {
  return (
    <section
      className="scroll-section relative flex flex-col items-start justify-center text-white bg-[#1a2e23] py-16 px-0"
      id="section-journey"
    >
      {/* Small Fan Decoration at Top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-20"
      >
        <img src="https://i.ibb.co.com/n8skQqjh/Desain-tanpa-judul-1.png" alt="Fan Decoration" className="h-10 w-auto opacity-80" />
      </motion.div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative w-[90%] md:max-w-md bg-[#3c4e3f] rounded-r-[3rem] overflow-hidden flex flex-col items-start p-6 md:p-8 shadow-2xl"
      >
        {/* Background Video with Green Filter */}
        <div className="absolute inset-0 z-0">
          <video
            src={introVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2c4033]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#3c4e3f]/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-2xl md:text-3xl font-light tracking-wide text-white mb-8 leading-tight uppercase"
          >
            KISAH PERJALANAN
            <br />
            DUA INSAN YANG SALING MENCINTAI
          </motion.h2>

          {/* Love Story Paragraph */}
          <div className="w-full relative">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-sans text-xs leading-relaxed text-stone-200 font-light text-justify"
            >
              Tidak pernah kami sangka, dua orang asing yang berjalan di jalan hidup masing-masing akan dipertemukan oleh semesta. Berawal dari sapaan sederhana, tumbuh percakapan yang tak pernah terasa membosankan. Hari demi hari, tanpa disadari, nama yang dulu biasa saja perlahan menjadi doa yang selalu ingin disebutkan.
            </motion.p>
          </div>

          {/* Bottom Horizontal Border with names */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-full mt-10 pt-4 border-t border-white/20 flex justify-between items-center text-white select-none"
          >
            <div className="w-16 h-[1px] bg-white/20" />
            <span className="font-serif italic text-xs tracking-wider text-[#d8d3c5]">
              Tiyah &amp; Puguh
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
