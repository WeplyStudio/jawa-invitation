import { motion } from "motion/react";
import groomImg from "../assets/groom.jpg";

export default function Groom() {
  return (
    <section
      className="scroll-section relative flex flex-col items-center justify-start text-white bg-transparent pt-12 pb-16 px-4"
      id="section-groom"
    >
      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm md:max-w-md bg-[#3c4e3f] rounded-t-[10rem] flex flex-col items-center p-4 pb-10"
      >
        {/* Image Placeholder */}
        <div className="w-full aspect-[5/4] md:aspect-[4/3] bg-stone-200 rounded-tl-none rounded-tr-[5rem] rounded-bl-none rounded-br-none mb-6 overflow-hidden relative">
          <img
            src={groomImg}
            alt="The Groom"
            className="w-full h-full object-cover"
          />
        </div>

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
            MEMPELAI PRIA
          </motion.p>

          {/* LARGE NAME */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-light tracking-wide text-white mb-4 leading-tight"
          >
            Puguh
            <br />
            Budi Utanto
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
              Putra dari
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
            Anak ke-4 (Putra keempat) dari keluarga Alm. Bapak Karimin dan Ibu Tumini. Menemukan pelabuhan terakhir cintanya pada diri Tiyah Munti Rahayu.
          </motion.p>


        </div>
      </motion.div>
    </section>
  );
}

