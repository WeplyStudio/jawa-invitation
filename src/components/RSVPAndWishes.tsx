import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, MessageSquare, Send, Users, Heart, ShieldAlert, X, ChevronLeft, Search, Trash2, Lock, LogOut, Check, Plus, Clipboard, List, AlertCircle, Copy, Eye, EyeOff } from "lucide-react";
import { Drawer } from "vaul";
import { RSVP, Wish, Broadcast } from "../types";
import { db } from "../lib/firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";

export default function RSVPAndWishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  // Cleanup previously seeded dummy/mock data documents from Firestore on startup
  useEffect(() => {
    const cleanDummyData = async () => {
      const dummyWishIds = ["wish-1", "wish-2", "wish-3"];
      const dummyRsvpIds = ["rsvp-1", "rsvp-2"];
      
      for (const id of dummyWishIds) {
        try {
          await deleteDoc(doc(db, "wishes", id));
        } catch (error) {
          console.error(`Error deleting dummy wish ${id}:`, error);
        }
      }
      for (const id of dummyRsvpIds) {
        try {
          await deleteDoc(doc(db, "rsvps", id));
        } catch (error) {
          console.error(`Error deleting dummy rsvp ${id}:`, error);
        }
      }
    };
    
    cleanDummyData();
  }, []);

  // Wizard Step State
  const [step, setStep] = useState(1);

  // Form states
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttendance, setRsvpAttendance] = useState<"Hadir" | "Tidak Hadir" | "">("");
  const [rsvpNote, setRsvpNote] = useState("");

  // UI and Authentication State
  const [showWishesModal, setShowWishesModal] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "owner" | null>(null);

  // Tab State inside Dashboard Panel (rsvps, wishes, broadcasts)
  const [adminTab, setAdminTab] = useState<"rsvps" | "wishes" | "broadcasts">("rsvps");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // Broadcast list form states
  const [singleGuestName, setSingleGuestName] = useState("");
  const [singleGuestPhone, setSingleGuestPhone] = useState("");
  const [bulkInputText, setBulkInputText] = useState("");
  const [broadcastFormMode, setBroadcastFormMode] = useState<"single" | "bulk">("single");
  const [broadcastMessagePreset, setBroadcastMessagePreset] = useState(
    "Halo *{NAMA}*, kami mengundang Anda untuk merayakan kebahagiaan kami di pernikahan Puguh & Munti.\n\nInfo lengkap & undangan digital Anda dapat diakses di link berikut:\n{LINK}\n\nMerupakan suatu kehormatan & kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nSalam hangat,\nPuguh & Munti"
  );

  // Real-time synchronization with Firestore NoSQL database
  useEffect(() => {
    // 1. Listen to Wishes
    const wishesQuery = query(collection(db, "wishes"));
    const unsubscribeWishes = onSnapshot(wishesQuery, async (snapshot) => {
      const list: Wish[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || "",
          relationship: data.relationship || "Teman",
          message: data.message || "",
          timestamp: data.timestamp || "",
        });
      });

      // Sort wishes so newer entries are on top.
      list.sort((a, b) => b.id.localeCompare(a.id));
      setWishes(list);
    });

    // 2. Listen to RSVPs
    const rsvpsQuery = query(collection(db, "rsvps"));
    const unsubscribeRsvps = onSnapshot(rsvpsQuery, async (snapshot) => {
      const list: RSVP[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || "",
          phone: data.phone || "",
          attendance: data.attendance || "Hadir",
          guestsCount: Number(data.guestsCount ?? 0),
          note: data.note || "",
          timestamp: data.timestamp || "",
        });
      });

      list.sort((a, b) => b.id.localeCompare(a.id));
      setRsvps(list);
    });

    // 3. Listen to Broadcast Requests
    const broadcastsQuery = query(collection(db, "broadcasts"));
    const unsubscribeBroadcasts = onSnapshot(broadcastsQuery, async (snapshot) => {
      const list: Broadcast[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || "",
          phone: data.phone || "",
          status: (data.status as "Belum Dikirim" | "Sudah Dikirim") || "Belum Dikirim",
          timestamp: data.timestamp || "",
        });
      });

      list.sort((a, b) => b.id.localeCompare(a.id));
      setBroadcasts(list);
    });

    return () => {
      unsubscribeWishes();
      unsubscribeRsvps();
      unsubscribeBroadcasts();
    };
  }, []);

  // Authentication Flow Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginUsername.trim().toLowerCase();
    const pass = loginPassword;

    if (user === "admin" && pass === "admin123") {
      setCurrentUserRole("admin");
      setShowLoginModal(false);
      setShowAdminView(true);
      setAdminTab("rsvps");
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
    } else if ((user === "tiyah" || user === "munti") && pass === "ikatjanjikami") {
      setCurrentUserRole("owner");
      setShowLoginModal(false);
      setShowAdminView(true);
      setAdminTab("rsvps");
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
    } else {
      setLoginError("Username atau Password salah!");
    }
  };

  const handleOpenDashboardClick = () => {
    if (currentUserRole) {
      setShowAdminView(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
    setShowAdminView(false);
    setShowLoginModal(false);
  };

  // Broadcast Sebar Form Handlers
  const handleAddSingleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleGuestName.trim() || !singleGuestPhone.trim()) return;

    const timestamp = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const id = "broadcast-" + Date.now();
    const broadcastData = {
      name: singleGuestName.trim(),
      phone: singleGuestPhone.trim(),
      status: "Belum Dikirim",
      timestamp,
    };

    try {
      await setDoc(doc(db, "broadcasts", id), broadcastData);
      setSingleGuestName("");
      setSingleGuestPhone("");
    } catch (error) {
      console.error("Error adding single broadcast: ", error);
    }
  };

  const handleAddBulkBroadcasts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInputText.trim()) return;

    const lines = bulkInputText.split("\n");
    const timestamp = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let count = 0;
    for (const line of lines) {
      if (!line.trim()) continue;

      let name = "";
      let phone = "";

      if (line.includes("-")) {
        const parts = line.split("-");
        name = parts[0].trim();
        phone = parts[1].trim();
      } else if (line.includes(",")) {
        const parts = line.split(",");
        name = parts[0].trim();
        phone = parts[1].trim();
      } else {
        const lastSpace = line.lastIndexOf(" ");
        if (lastSpace > 0) {
          name = line.substring(0, lastSpace).trim();
          phone = line.substring(lastSpace).trim();
        } else {
          name = line.trim();
          phone = "";
        }
      }

      // Sanitize phone (keep numbers)
      phone = phone.replace(/[^0-9]/g, "");

      if (name && phone) {
        const id = `broadcast-${Date.now()}-${count}`;
        const broadcastData = {
          name,
          phone,
          status: "Belum Dikirim",
          timestamp,
        };
        try {
          await setDoc(doc(db, "broadcasts", id), broadcastData);
          count++;
        } catch (error) {
          console.error("Error writing bulk broadcast: ", error);
        }
      }
    }

    setBulkInputText("");
  };

  const handleSendWhatsApp = (item: Broadcast) => {
    let cleanPhone = item.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith("62") && cleanPhone.length > 5) {
      cleanPhone = "62" + cleanPhone;
    }

    const invitationLink = `${window.location.origin}/?to=${encodeURIComponent(item.name)}`;
    const message = broadcastMessagePreset
      .replace(/{NAMA}/g, item.name)
      .replace(/{LINK}/g, invitationLink);

    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // Automatically mark as sent for smooth experience
    handleToggleBroadcastStatus(item.id, "Sudah Dikirim");
  };

  const handleToggleBroadcastStatus = async (id: string, newStatus: "Belum Dikirim" | "Sudah Dikirim") => {
    try {
      await setDoc(doc(db, "broadcasts", id), { status: newStatus }, { merge: true });
    } catch (error) {
      console.error("Error toggling status: ", error);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus antrean undangan ini?")) {
      try {
        await deleteDoc(doc(db, "broadcasts", id));
      } catch (error) {
        console.error("Error deleting broadcast: ", error);
      }
    }
  };


  const handleNextStep = () => {
    if (step === 1 && !rsvpName.trim()) return;
    if (step === 2 && !rsvpAttendance) return;
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitRsvpFlow = async () => {
    if (!rsvpName.trim() || !rsvpAttendance) return;

    const timestamp = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const idSuffix = Date.now();
    const rsvpId = "rsvp-" + idSuffix;

    const rsvpData = {
      name: rsvpName.trim(),
      phone: "-",
      attendance: rsvpAttendance as "Hadir" | "Tidak Hadir",
      guestsCount: rsvpAttendance === "Hadir" ? 1 : 0,
      note: rsvpNote.trim() || "",
      timestamp,
    };

    try {
      // Save to rsvps collection
      await setDoc(doc(db, "rsvps", rsvpId), rsvpData);

      // Save as Wish too if wishes text is not empty
      if (rsvpNote.trim()) {
        const wishId = "wish-" + idSuffix;
        const wishData = {
          name: rsvpName.trim(),
          relationship: "Teman" as const,
          message: rsvpNote.trim(),
          timestamp,
        };
        await setDoc(doc(db, "wishes", wishId), wishData);
      }

      // Proceed to success step (Step 4)
      setStep(4);
    } catch (error) {
      console.error("Error submitting RSVP: ", error);
    }
  };

  const handleDeleteRsvp = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus RSVP ini?")) {
      try {
        await deleteDoc(doc(db, "rsvps", id));
      } catch (error) {
        console.error("Error deleting RSVP: ", error);
      }
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) {
      try {
        await deleteDoc(doc(db, "wishes", id));
      } catch (error) {
        console.error("Error deleting wish: ", error);
      }
    }
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
      className="scroll-section relative flex flex-col items-center justify-between text-white bg-transparent px-8 pt-8 pb-12"
      id="section-rsvp"
    >
      {/* Dark Filter over the background */}
      <div className="absolute inset-0 bg-black/75 pointer-events-none z-0" />

      {/* Top Page Count Indicator matching style */}
      <div className="relative z-10 font-sans text-xs tracking-[0.3em] text-white/80 font-light select-none shrink-0 mt-2">
        09 / 11
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
          Mohon Konfirmasi Kehadiran Anda
          <br />
          Dan Kirimkan Doa Restu
        </motion.h2>

        {/* Dynamic Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-sans text-[11px] leading-relaxed text-gray-300 font-light max-w-sm mb-5"
        >
          {step === 4 ? (
            "Terima kasih atas konfirmasi kehadiran Anda. Setiap restu dan doa Anda sangatlah berharga untuk lembaran kehidupan baru kami."
          ) : (
            "Mohon luangkan waktu sejenak untuk mengisi formulir konfirmasi kehadiran di bawah ini, serta menuliskan ucapan selamat dan doa restu terbaik Anda untuk kedua mempelai."
          )}
        </motion.p>

        {/* Circular Progress Steps */}
        <div className="flex items-center justify-between w-full max-w-xs mb-4 relative px-4">
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
        <div className="w-full min-h-[140px] flex items-center justify-center mb-5">
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
                  NAMA TAMU
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
                  LANJUT
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
                  KONFIRMASI KEHADIRAN
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
                    SAYA AKAN HADIR
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
                    SAYANGNYA TIDAK HADIR
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 bg-stone-800/60 hover:bg-stone-800 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/10 transition-all cursor-pointer"
                  >
                    KEMBALI
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!rsvpAttendance}
                    className="py-3 bg-black hover:bg-stone-950 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/15 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    LANJUT
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
                  UCAPAN &amp; DOA RESTU
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
                    KEMBALI
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitRsvpFlow}
                    className="py-3 bg-black hover:bg-stone-950 text-white font-sans text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-white/15 transition-all cursor-pointer"
                  >
                    KIRIM
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

        {/* Wishes Display Area - Compact Button and Dashboard to save space */}
        <div className="w-full pt-4 border-t border-white/10 flex flex-col items-center">
          <h3 className="font-serif italic text-base text-white font-light tracking-wide mb-2">
            Ucapan &amp; Doa Restu
          </h3>
          <p className="font-sans text-[10px] text-gray-400 text-center mb-2.5 max-w-[280px]">
            Klik tombol di bawah ini untuk melihat ucapan selamat dan doa restu dari para tamu undangan lainnya.
          </p>
          <div className="flex w-full max-w-[300px] justify-center">
            <button
              onClick={() => setShowWishesModal(true)}
              className="w-full px-4 py-2.5 bg-white text-stone-950 text-[10.5px] tracking-widest uppercase font-sans font-bold rounded-sm hover:bg-stone-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
            >
              <MessageSquare className="w-3.5 h-3.5 text-stone-950" />
              <span>Lihat Ucapan ({wishes.length})</span>
            </button>
          </div>
        </div>

      </div>

      {/* Floating Utilities & Branding */}
      <div className="relative z-10 h-2 mt-2 shrink-0" />

      {/* Modern Vaul Bottom Sheet Drawer for Buku Tamu / Guestbook */}
      <Drawer.Root open={showWishesModal} onOpenChange={setShowWishesModal}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] outline-none flex flex-col bg-stone-900 border-t border-white/15 rounded-t-2xl">
            <div className="p-4 bg-stone-900 rounded-t-2xl flex-1 flex flex-col overflow-hidden max-w-md mx-auto w-full">
              {/* Grab bar / Notch */}
              <div className="mx-auto w-12 h-1 flex-shrink-0 rounded-full bg-white/20 mb-4" />

              {/* Header */}
              <div className="flex justify-between items-center mb-4 shrink-0 px-2">
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
              <div className="mb-4 shrink-0 px-2">
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
              <div className="flex-1 overflow-y-auto px-2 space-y-3 pb-6 no-scrollbar">
                {filteredWishes.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
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
              <div className="pt-3 border-t border-white/5 shrink-0 flex justify-end">
                <button
                  onClick={() => setShowWishesModal(false)}
                  className="px-4 py-1.5 bg-white text-stone-950 font-sans text-[9px] tracking-widest uppercase font-semibold rounded-sm hover:bg-gray-100 transition-all cursor-pointer"
                >
                  SELESAI
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

    </section>
  );
}
