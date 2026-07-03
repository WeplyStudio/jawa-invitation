import { motion } from "motion/react";
import { Gift, Copy, ExternalLink, CreditCard } from "lucide-react";
import { useState } from "react";
import fanImage from "../assets/images/wedding_fan_1782982225373.jpg";

export default function GiftSection() {
  const [copied, setCopied] = useState(false);
  const accountNumber = "1323422894"; // Example
  const bankName = "BNI";
  const accountHolder = "Munti Tiyah Rahayu";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="scroll-section relative flex flex-col items-center justify-between text-white bg-[#1a2e23] px-8 py-16"
      id="section-gift"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm text-center flex flex-col items-center"
      >
        <img
          src={fanImage}
          alt="Wedding Fan"
          className="w-16 h-16 object-contain mb-4 mix-blend-screen"
        />
        <h2 className="font-serif text-2xl font-normal tracking-[0.15em] text-white mb-6 uppercase">
          Kado Pernikahan
        </h2>
        <p className="font-sans text-xs leading-relaxed text-stone-300 font-light mb-10">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun, jika Anda ingin mengirimkan tanda kasih, Anda dapat melakukannya melalui pilihan di bawah ini:
        </p>

        {/* Bank Account */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 mb-6">
          <CreditCard className="w-8 h-8 mx-auto text-stone-300 mb-4" />
          <h3 className="font-serif text-sm tracking-widest text-white uppercase mb-1">
            {bankName}
          </h3>
          <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest mb-4">
            A/n {accountHolder}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-lg tracking-widest">{accountNumber}</span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          {copied && (
            <p className="font-sans text-[9px] text-emerald-400 mt-2 uppercase tracking-widest">
              Tersalin!
            </p>
          )}
        </div>

        {/* Shopee */}
        <a
          href="https://shopee.co.id"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-stone-900 font-sans text-xs tracking-widest uppercase font-semibold rounded-full hover:bg-stone-200 transition-all"
        >
          <Gift className="w-4 h-4" />
          Kirim Kado Digital
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </motion.div>
    </section>
  );
}
