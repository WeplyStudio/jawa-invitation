import { motion } from "motion/react";
import { Quote as QuoteIcon, Heart } from "lucide-react";

export default function Quote() {
  return (
    <section
      className="scroll-section relative flex flex-col items-center justify-between text-white bg-[#1a2e23] px-6 py-16"
      id="section-quote"
    >
      {/* Small Fan Decoration at Top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none"
      >
        <img src="https://i.ibb.co.com/n8skQqjh/Desain-tanpa-judul-1.png" alt="Fan Decoration" className="h-12 w-auto opacity-80" />
      </motion.div>

      {/* Main Quote Content Wrapper matching the user image perfectly */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-start text-left max-w-sm md:max-w-md w-full">
        {/* Quote Accent Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <QuoteIcon className="w-8 h-8 text-stone-300 opacity-60" />
        </motion.div>

        {/* Holy Scripture Source Header */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-3xl md:text-4xl tracking-wide text-white uppercase mb-4"
        >
          Q.S AR-RUM: 21
        </motion.h2>

        {/* Poetic Scripture Quote Body Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
          className="font-sans text-xs md:text-sm text-gray-200 font-light leading-relaxed tracking-wide mb-8 text-justify"
        >
          “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”
        </motion.p>

        {/* Couple Signature Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center gap-2 mt-4"
        >
          <span className="font-serif italic text-lg md:text-xl text-stone-300 font-light">
            Munti &amp; Puguh
          </span>
          <Heart className="w-3.5 h-3.5 text-stone-400 fill-stone-400/20 animate-pulse" />
        </motion.div>
      </div>


    </section>
  );
}
