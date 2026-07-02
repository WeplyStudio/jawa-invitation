import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, MessageSquare, Send, Users, Heart, ShieldAlert, X, ChevronLeft, Search } from "lucide-react";
import { RSVP, Wish } from "../types";

export default function RSVPAndWishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

  // Wizard Step State
  const [step, setStep] = useState(1);

  // Form states
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttendance, setRsvpAttendance] = useState<"Hadir" | "Tidak Hadir" | "">("");
  const [rsvpNote, setRsvpNote] = useState("");

  // UI state
  const [showWishesModal, setShowWishesModal] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load initial mockup and save to localStorage
  useEffect(() => {
    const savedWishes = localStorage.getItem("wedding_wishes");
    const savedRsvps = localStorage.getItem("wedding_rsvps");

    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    } else {
      const initialWishes: Wish[] = [
        {
          id: "w-1",
          name: "Saras & Rian",
          relationship: "Sahabat",
          message: "Selamat ya Puguh dan Tiyah! Senang sekali melihat kalian akhirnya melangkah ke pelaminan. Semoga dilancarkan sampai hari-H dan selalu harmonis!",
          timestamp: "30 Juni 2026",
        },
        {
          id: "w-2",
          name: "Budi Santoso",
          relationship: "Keluarga",
          message: "Selamat menempuh hidup baru untuk keponakanku tersayang. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
          timestamp: "30 Juni 2026",
        },
        {
          id: "w-3",
          name: "Jessica Lauren",
          relationship: "Teman",
          message: "Happy Wedding guys! Wishing you both a lifetime of love, laughter, and endless happiness together!",
          timestamp: "29 Juni 2026",
        }
      ];
      setWishes(initialWishes);
      localStorage.setItem("wedding_wishes", JSON.stringify(initialWishes));
    }

    if (savedRsvps) {
      setRsvps(JSON.parse(savedRsvps));
    } else {
      const initialRsvps: RSVP[] = [
        {
          id: "r-1",
          name: "Saras & Rian",
          phone: "-",
          attendance: "Hadir",
          guestsCount: 2,
          note: "Semoga bahagia selalu!",
          timestamp: "30 Juni 2026",
        },
        {
          id: "r-2",
          name: "Budi Santoso",
          phone: "-",
          attendance: "Hadir",
          guestsCount: 2,
          timestamp: "30 Juni 2026",
        }
      ];
      setRsvps(initialRsvps);
      localStorage.setItem("wedding_rsvps", JSON.stringify(initialRsvps));
    }
  }, []);

  const handleNextStep = () => {
    if (step === 1 && !rsvpName.trim()) return;
    if (step === 2 && !rsvpAttendance) return;
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitRsvpFlow = () => {
    if (!rsvpName.trim() || !rsvpAttendance) return;

    const timestamp = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newRsvp: RSVP = {
      id: "rsvp-" + Date.now(),
      name: rsvpName.trim(),
      phone: "-",
      attendance: rsvpAttendance as "Hadir" | "Tidak Hadir",
      guestsCount: rsvpAttendance === "Hadir" ? 1 : 0,
      note: rsvpNote.trim() || undefined,
      timestamp,
    };

    // Save as Wish too if wishes text is not empty
    if (rsvpNote.trim()) {
      const newWish: Wish = {
        id: "wish-" + Date.now(),
        name: rsvpName.trim(),
        relationship: "Teman",
        message: rsvpNote.trim(),
        timestamp,
      };
      const updatedWishes = [newWish, ...wishes];
      setWishes(updatedWishes);
      localStorage.setItem("wedding_wishes", JSON.stringify(updatedWishes));
    }

    const updatedRsvps = [newRsvp, ...rsvps];
    setRsvps(updatedRsvps);
    localStorage.setItem("wedding_rsvps", JSON.stringify(updatedRsvps));

    // Proceed to success step (Step 4)
    setStep(4);
  };

  const handleResetForm = () => {
    setRsvpName("");
    setRsvpAttendance("");
    setRsvpNote("");
    setStep(1);
  };

  const totalGuests = rsvps
    .filter((r) => r.attendance === "Hadir")
    .reduce((sum, current) => sum + current.guestsCount, 0);

  const filteredWishes = wishes.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      className="scroll-section relative flex flex-col items-center justify-between text-white bg-transparent px-8 py-14"
      id="section-rsvp"
    >
      {/* Dark Filter over the background */}
      <div className="absolute inset-0 bg-black/75 pointer-events-none z-0" />

      {/* Top Page Count Indicator matching style */}
      <div className="relative z-10 font-sans text-xs tracking-[0.3em] text-white/80 font-light select-none shrink-0 mt-2">
        11 / 12
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center max-w-sm md:max-w-md w-full py-4">
        
        {/* Elegant Serif Italic Title matching reference */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-serif italic text-2xl md:text-3xl font-light tracking-wide text-white mb-3 leading-snug"
        >
          Kindly Confirm Your Presence
          <br />
          And Share Your Blessings
        </motion.h2>

        {/* Dynamic Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-sans text-[11px] leading-relaxed text-gray-300 font-light max-w-sm mb-8"
        >
          {step === 4 ? (
            "Terima kasih atas konfirmasi kehadiran Anda. Setiap restu dan doa Anda sangatlah berharga untuk lembaran kehidupan baru kami."
          ) : (
            "We kindly request your prompt response to confirm your attendance at our upcoming event. Alongside your RSVP, please take a moment to extend your warm regards and best wishes."
          )}
        </motion.p>

        {/* Circular Progress Steps */}
        <div className="flex items-center justify-between w-full max-w-xs mb-8 relative px-4">
          {[1, 2, 3, 4].map((num, idx) => (
            <React.Fragment key={num}>
              {idx > 0 && (
                <div
                  className={`flex-1 h-[1px] mx-1.5 transition-all duration-500 ${
                    step >= num ? "bg-emerald-500" : "bg-white/20"
                  }`}
                />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-sans font-medium transition-all duration-500 shrink-0 ${
                  step >= num
                    ? "bg-emerald-600 text-white font-semibold border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "bg-white text-stone-900 border border-white/20"
                }`}
              >
                {num}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Animated Form Steps Area */}
        <div className="w-full min-h-[160px] flex items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full text-left"
              >
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-semibold">
                  NAME
                </label>
                <input
                  type="text"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Nama Tamu"
                  className="w-full px-4 py-3 rounded-lg border border-white/10 text-xs font-sans focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all text-white bg-black/45 mb-6 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!rsvpName.trim()}
                  className="w-full py-3 bg-black hover:bg-stone-950 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/15 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  NEXT
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full text-left"
              >
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3 font-semibold">
                  ATTENDANCE
                </label>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setRsvpAttendance("Hadir")}
                    className={`py-3.5 px-2 rounded-lg border text-[9px] font-sans tracking-widest uppercase font-semibold transition-all cursor-pointer ${
                      rsvpAttendance === "Hadir"
                        ? "bg-white text-stone-950 border-white font-bold"
                        : "bg-black/30 text-white border-white/10 hover:border-white/30"
                    }`}
                  >
                    EXCITED TO ATTEND
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttendance("Tidak Hadir")}
                    className={`py-3.5 px-2 rounded-lg border text-[9px] font-sans tracking-widest uppercase font-semibold transition-all cursor-pointer ${
                      rsvpAttendance === "Tidak Hadir"
                        ? "bg-white text-stone-950 border-white font-bold"
                        : "bg-black/30 text-white border-white/10 hover:border-white/30"
                    }`}
                  >
                    UNABLE ATTEND
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 bg-stone-800/60 hover:bg-stone-800 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/10 transition-all cursor-pointer"
                  >
                    PREVIOUS
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!rsvpAttendance}
                    className="py-3 bg-black hover:bg-stone-950 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/15 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    NEXT
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full text-left"
              >
                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-semibold">
                  WISHES
                </label>
                <textarea
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  placeholder="Tulis ucapan selamat & doa restu di sini..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 text-xs font-sans focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all text-white bg-black/45 mb-6 placeholder-gray-500 resize-none"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 bg-stone-800/60 hover:bg-stone-800 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/10 transition-all cursor-pointer"
                  >
                    PREVIOUS
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitRsvpFlow}
                    className="py-3 bg-black hover:bg-stone-950 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/15 transition-all cursor-pointer"
                  >
                    SEND
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-serif text-lg text-white mb-2 font-light">
                  RSVP Berhasil Dikirim!
                </h3>
                <p className="font-sans text-[11px] text-gray-400 mb-6 max-w-xs">
                  Konfirmasi Anda atas nama <span className="font-semibold text-white">{rsvpName}</span> ({rsvpAttendance === "Hadir" ? "Hadir" : "Tidak Hadir"}) telah tersimpan.
                </p>

                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white border border-white/10 rounded-md font-sans text-[9px] tracking-widest uppercase font-medium cursor-pointer transition-all"
                  >
                    Kirim Doa Lain
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wishes Display Area */}
        <div className="w-full pt-8 border-t border-white/10 flex flex-col items-center">
          <h3 className="font-serif italic text-xl text-white font-light tracking-wide mb-6">
            Wishes &amp; Blessings
          </h3>
          
          <div className="w-full space-y-4 mb-6">
            {wishes.slice(0, 3).map((w, idx) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="text-left w-full bg-black/40 p-4 rounded-xl border border-white/5"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-serif text-sm font-medium text-white">{w.name}</span>
                  <span className="font-sans text-[9px] text-gray-500 tracking-wider">{w.timestamp}</span>
                </div>
                <p className="font-sans text-[11px] leading-relaxed text-gray-300 font-light italic">
                  "{w.message}"
                </p>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setShowWishesModal(true)}
            className="px-6 py-2.5 bg-transparent border border-white/20 text-white text-[10px] tracking-widest uppercase font-sans font-medium rounded-sm hover:bg-white/10 transition-colors cursor-pointer"
          >
            Lihat Semua Ucapan ({wishes.length})
          </button>
        </div>

      </div>

      {/* Floating Utilities & Branding */}
      <div className="relative z-10 h-8 mt-6 shrink-0" />

      {/* Beautiful overlay modal for Guestbook / Board of Wishes */}
      <AnimatePresence>
        {showWishesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[520px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-stone-950 p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-stone-300" />
                  <div>
                    <h4 className="font-serif text-sm font-light text-white">Buku Tamu &amp; Doa Restu</h4>
                    <p className="text-[9px] text-gray-400 font-sans uppercase tracking-wider">
                      {wishes.length} Doa Terkirim
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWishesModal(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3 bg-stone-900/60 border-b border-white/5 shrink-0">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama tamu atau ucapan..."
                    className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-sans focus:outline-none focus:border-white/40 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Scrollable list of wishes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {filteredWishes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <Heart className="w-8 h-8 text-stone-700 mb-2" />
                    <p className="text-xs text-gray-500 font-serif italic">
                      Tidak ada doa restu yang ditemukan.
                    </p>
                  </div>
                ) : (
                  filteredWishes.map((w) => (
                    <div
                      key={w.id}
                      className="p-3.5 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-all"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="font-serif text-xs font-medium text-white block">
                            {w.name}
                          </span>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-white/10 text-stone-300 text-[8px] font-sans rounded font-medium uppercase tracking-wider">
                            {w.relationship}
                          </span>
                        </div>
                        <span className="font-sans text-[8px] text-gray-500">{w.timestamp}</span>
                      </div>
                      <p className="font-sans text-[10px] leading-relaxed text-gray-300 font-light italic">
                        "{w.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3.5 bg-stone-950 border-t border-white/10 shrink-0 flex justify-end">
                <button
                  onClick={() => setShowWishesModal(false)}
                  className="px-4 py-1.5 bg-white text-stone-950 font-sans text-[9px] tracking-widest uppercase font-semibold rounded-sm hover:bg-gray-100 transition-all cursor-pointer"
                >
                  SELESAI
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Dashboard Modal for RSVP Data */}
      <AnimatePresence>
        {showAdminView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[500px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-stone-950 p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-stone-300" />
                  <div>
                    <h4 className="font-serif text-sm font-light text-white">Rekapitulasi Tamu &amp; RSVP</h4>
                    <p className="text-[9px] text-gray-400 font-sans uppercase tracking-wider">
                      Data terekam secara lokal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminView(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col overflow-hidden">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3 mb-5 text-center shrink-0">
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/5">
                    <p className="text-[8px] text-gray-400 font-sans uppercase tracking-wider">Total Respon</p>
                    <p className="text-lg font-serif text-stone-300 font-light mt-0.5">{rsvps.length}</p>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/5">
                    <p className="text-[8px] text-gray-400 font-sans uppercase tracking-wider">Hadir (Sesi)</p>
                    <p className="text-lg font-serif text-emerald-400 font-light mt-0.5">
                      {rsvps.filter((r) => r.attendance === "Hadir").length}
                    </p>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/5">
                    <p className="text-[8px] text-gray-400 font-sans uppercase tracking-wider">Total Tamu (Pax)</p>
                    <p className="text-lg font-serif text-blue-400 font-light mt-0.5">{totalGuests}</p>
                  </div>
                </div>

                {/* List of RSVP submissions */}
                <div className="flex-1 overflow-y-auto border border-white/10 rounded-xl bg-black/20 no-scrollbar">
                  {rsvps.length === 0 ? (
                    <p className="text-center py-12 text-xs text-gray-500 font-sans italic">
                      Belum ada tamu yang mengonfirmasi kehadiran.
                    </p>
                  ) : (
                    <table className="w-full text-left text-[11px] font-sans">
                      <thead className="bg-stone-950 text-gray-400 uppercase text-[8px] tracking-wider border-b border-white/5 sticky top-0">
                        <tr>
                          <th className="px-4 py-2.5">Nama Tamu</th>
                          <th className="px-4 py-2.5">Status</th>
                          <th className="px-4 py-2.5 text-center">Pax</th>
                          <th className="px-4 py-2.5">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {rsvps.map((r) => (
                          <tr key={r.id} className="hover:bg-white/5">
                            <td className="px-4 py-2.5 font-medium text-white">{r.name}</td>
                            <td className="px-4 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                  r.attendance === "Hadir"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                              >
                                {r.attendance}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-center font-bold">
                              {r.attendance === "Hadir" ? r.guestsCount : "-"}
                            </td>
                            <td className="px-4 py-2.5 text-gray-400 max-w-[120px] truncate" title={r.note}>
                              {r.note || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="p-4 bg-stone-950 border-t border-white/10 shrink-0 flex justify-end">
                <button
                  onClick={() => setShowAdminView(false)}
                  className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-white font-sans text-[9px] tracking-widest uppercase font-semibold rounded-sm transition-all cursor-pointer"
                >
                  SELESAI
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
