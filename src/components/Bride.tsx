import { motion } from "motion/react";
import brideImg from "../assets/bride.jpg";

export default function Bride() {
  return (
    <section
      className="scroll-section relative flex flex-col items-center justify-start text-white bg-transparent pt-4 pb-16 px-4"
      id="section-bride"
    >
      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm md:max-w-md bg-[#3c4e3f] rounded-bl-[10rem] flex flex-col items-center p-4 pt-10 pb-4"
      >
        {/* Profile Info Block */}
        <div className="w-full flex flex-col items-start text-left px-0">
          
          {/* SMALL HEADER TAG */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-sans text-[8px] uppercase tracking-[0.35em] text-stone-300 font-bold mb-3"
          >
            MEMPELAI WANITA
          </motion.p>

          {/* LARGE NAME */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-light tracking-wide text-white mb-4 leading-tight"
          >
            Tiyah
            <br />
            Munti Rahayu
          </motion.h2>

          {/* PARENTAL LINE */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100%" }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-3 w-full mb-4"
          >
            <span className="font-serif italic text-[11px] text-stone-200 whitespace-nowrap">
              Putri dari
            </span>
            <div className="flex-1 h-[1px] bg-white/20" />
          </motion.div>

          {/* BIOGRAPHY */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-[10px] leading-relaxed text-stone-200 font-light mb-6"
          >
            Anak ke-3 (Putri ketiga) dari keluarga Bapak Kasdi dan Ibu Sri Wahyuni. Menemukan pelabuhan terakhir cintanya pada diri Puguh Budi Utanto.
          </motion.p>


        </div>

        {/* Image Placeholder */}
        <div className="w-full aspect-[5/4] md:aspect-[4/3] bg-stone-200 rounded-tl-none rounded-tr-none rounded-bl-[9rem] rounded-br-none mt-8 mb-0 overflow-hidden relative">
          <img
            src={brideImg}
            alt="The Bride"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 60%" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
