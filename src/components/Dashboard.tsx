import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  ShieldAlert,
  X,
  Search,
  Trash2,
  Lock,
  LogOut,
  Check,
  Plus,
  Clipboard,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  MessageSquare,
  Home,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { RSVP, Wish, Broadcast } from "../types";
import { db } from "../lib/firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";

export default function Dashboard() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "owner" | null>(null);
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Firestore Collections State
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  // Tab State inside Dashboard Panel (rsvps, wishes, broadcasts)
  const [adminTab, setAdminTab] = useState<"rsvps" | "wishes" | "broadcasts">("rsvps");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // Broadcast list form states
  const [singleGuestName, setSingleGuestName] = useState("");
  const [singleGuestPhone, setSingleGuestPhone] = useState("");
  const [bulkInputText, setBulkInputText] = useState("");
  const [broadcastFormMode, setBroadcastFormMode] = useState<"single" | "bulk">("single");
  const [broadcastMessagePreset, setBroadcastMessagePreset] = useState(
    "Halo *{NAMA}*, kami mengundang Anda untuk merayakan kebahagiaan kami di pernikahan Puguh & Tiyah.\n\nInfo lengkap & undangan digital Anda dapat diakses di link berikut:\n{LINK}\n\nMerupakan suatu kehormatan & kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nSalam hangat,\nPuguh & Tiyah"
  );

  // Load active session from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("dashboard_role");
    if (savedRole === "admin" || savedRole === "owner") {
      setCurrentUserRole(savedRole as "admin" | "owner");
      setIsLoggedIn(true);
    }
  }, []);

  // Real-time synchronization with Firestore NoSQL database
  useEffect(() => {
    if (!isLoggedIn) return;

    // 1. Listen to RSVP Guestbook
    const rsvpsQuery = query(collection(db, "rsvps"));
    const unsubscribeRsvps = onSnapshot(rsvpsQuery, (snapshot) => {
      const list: RSVP[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || "",
          phone: data.phone || "",
          attendance: (data.attendance as "Hadir" | "Tidak Hadir") || "Hadir",
          guestsCount: Number(data.guestsCount) || 1,
          note: data.note || "",
          timestamp: data.timestamp || "",
        });
      });
      list.sort((a, b) => b.id.localeCompare(a.id));
      setRsvps(list);
    });

    // 2. Listen to Wishes
    const wishesQuery = query(collection(db, "wishes"));
    const unsubscribeWishes = onSnapshot(wishesQuery, (snapshot) => {
      const list: Wish[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || "",
          relationship: (data.relationship as any) || "Teman",
          message: data.message || "",
          timestamp: data.timestamp || "",
        });
      });
      list.sort((a, b) => b.id.localeCompare(a.id));
      setWishes(list);
    });

    // 3. Listen to Broadcast Requests
    const broadcastsQuery = query(collection(db, "broadcasts"));
    const unsubscribeBroadcasts = onSnapshot(broadcastsQuery, (snapshot) => {
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
  }, [isLoggedIn]);

  // Authentication Flow Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginUsername.trim().toLowerCase();
    const pass = loginPassword;

    if (user === "admin" && pass === "admin123") {
      setCurrentUserRole("admin");
      setIsLoggedIn(true);
      localStorage.setItem("dashboard_role", "admin");
      setAdminTab("rsvps");
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
    } else if (user === "tiyah" && pass === "ikatjanjikami") {
      setCurrentUserRole("owner");
      setIsLoggedIn(true);
      localStorage.setItem("dashboard_role", "owner");
      setAdminTab("rsvps");
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
    } else {
      setLoginError("Username atau Password salah!");
    }
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
    setIsLoggedIn(false);
    localStorage.removeItem("dashboard_role");
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

  const handleDeleteRsvp = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus konfirmasi RSVP ini secara permanen?")) {
      try {
        await deleteDoc(doc(db, "rsvps", id));
      } catch (error) {
        console.error("Error deleting RSVP: ", error);
      }
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ucapan ini secara permanen?")) {
      try {
        await deleteDoc(doc(db, "wishes", id));
      } catch (error) {
        console.error("Error deleting wish: ", error);
      }
    }
  };

  const totalGuests = rsvps
    .filter((r) => r.attendance === "Hadir")
    .reduce((acc, curr) => acc + curr.guestsCount, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      
      {/* 1. LOGIN INTERFACE (Sleek full-page login) */}
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center p-4 md:p-8"
          >
            <div className="w-full max-w-md bg-stone-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="bg-stone-950 p-6 border-b border-white/10 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-serif text-xl font-light text-white tracking-wide">Portal Pengelola</h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-sans mt-0.5">
                    Secure Dashboard Access Control
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-5">
                {loginError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2.5 text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-sans leading-relaxed">{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Masukkan username (contoh: admin / tiyah)"
                    className="w-full px-4 py-2.5 bg-stone-950 border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-amber-500/40 placeholder-gray-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan password Anda..."
                      className="w-full pl-4 pr-10 py-2.5 bg-stone-950 border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-amber-500/40 placeholder-gray-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 text-stone-950 font-sans text-[11px] tracking-widest uppercase font-bold rounded-lg hover:bg-amber-400 transition-colors cursor-pointer mt-4 shadow-lg shadow-amber-500/5"
                >
                  MASUK PORTAL
                </button>

                <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    Secure SSL Enforced
                  </span>
                  <a href="/" className="hover:text-stone-300 transition-colors flex items-center gap-1 font-bold">
                    <Home className="w-3 h-3" />
                    Kembali Ke Landing Page
                  </a>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          /* 2. LOGGED-IN PORTAL INTERFACE (Full Screen Dashboard Layout) */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-screen overflow-hidden"
          >
            {/* Top Bar Header */}
            <header className="bg-stone-900 border-b border-white/10 px-4 md:px-8 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-serif text-base md:text-lg font-light text-white tracking-wide">
                    {currentUserRole === "admin"
                      ? "Dashboard Administrator (Admin Access)"
                      : "Dashboard Pemilik Undangan (Owner Panel)"}
                  </h1>
                  <p className="text-[9px] md:text-[10px] text-emerald-400 font-sans uppercase tracking-widest font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    {currentUserRole === "admin"
                      ? "Akses Penuh / Full Control Mode"
                      : "Akses Pemilik / Tiyah Mode"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-[10px] font-sans font-bold tracking-wider uppercase transition-colors rounded-md"
                >
                  <Home className="w-3 h-3" />
                  <span>Landing Page</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[10px] font-sans font-bold tracking-wider uppercase transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </header>

            {/* Stats Cards Section */}
            <div className="px-4 md:px-8 py-4 bg-stone-900/50 border-b border-white/5 shrink-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                <div className="bg-stone-900 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-gray-400 font-sans uppercase tracking-wider">Total RSVP</p>
                  <p className="text-xl md:text-2xl font-serif text-amber-300 font-medium mt-0.5">{rsvps.length}</p>
                </div>
                <div className="bg-stone-900 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-gray-400 font-sans uppercase tracking-wider">Tamu Hadir</p>
                  <p className="text-xl md:text-2xl font-serif text-emerald-400 font-medium mt-0.5">
                    {rsvps.filter((r) => r.attendance === "Hadir").length}
                  </p>
                </div>
                <div className="bg-stone-900 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-gray-400 font-sans uppercase tracking-wider">Tamu (Pax)</p>
                  <p className="text-xl md:text-2xl font-serif text-blue-400 font-medium mt-0.5">{totalGuests}</p>
                </div>
                <div className="bg-stone-900 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-gray-400 font-sans uppercase tracking-wider">Total Ucapan & Doa</p>
                  <p className="text-xl md:text-2xl font-serif text-purple-400 font-medium mt-0.5">{wishes.length}</p>
                </div>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Sidebar/Tab Switcher Column */}
              <aside className="w-full md:w-64 bg-stone-900/30 border-b md:border-b-0 md:border-r border-white/10 p-4 flex flex-row md:flex-col justify-between shrink-0 gap-2 overflow-x-auto no-scrollbar">
                <div className="flex md:flex-col gap-1.5 w-full">
                  <button
                    onClick={() => setAdminTab("rsvps")}
                    className={`flex-1 md:flex-initial px-4 py-3 rounded-xl text-[11px] tracking-wider uppercase font-sans font-bold text-left transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                      adminTab === "rsvps"
                        ? "bg-amber-500 text-stone-950"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Buku Tamu / RSVP ({rsvps.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab("wishes")}
                    className={`flex-1 md:flex-initial px-4 py-3 rounded-xl text-[11px] tracking-wider uppercase font-sans font-bold text-left transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                      adminTab === "wishes"
                        ? "bg-amber-500 text-stone-950"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ucapan &amp; Doa ({wishes.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab("broadcasts")}
                    className={`flex-1 md:flex-initial px-4 py-3 rounded-xl text-[11px] tracking-wider uppercase font-sans font-bold text-left transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                      adminTab === "broadcasts"
                        ? "bg-amber-500 text-stone-950"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Clipboard className="w-4 h-4" />
                    <span>
                      {currentUserRole === "admin" ? "Antrean Sebar" : "Auto Sebar Undangan"} ({broadcasts.length})
                    </span>
                  </button>
                </div>

                <div className="hidden md:flex flex-col gap-1.5 bg-stone-900 p-3 rounded-xl border border-white/5 text-[9px] text-gray-500 leading-relaxed font-sans">
                  <p className="font-bold text-gray-400 uppercase tracking-wider mb-1">Akses Informasi</p>
                  <p>• Admin: Akses penuh memoderasi ucapan, RSVP, dan sebar WhatsApp.</p>
                  <p>• Pemilik: Memantau data tamu dan menyusun antrean sebar tanpa opsi hapus data krusial.</p>
                </div>
              </aside>

              {/* Data Table Area */}
              <main className="flex-1 flex flex-col overflow-hidden bg-black/20">
                {/* Search Bar & Title */}
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shrink-0">
                  <h3 className="font-serif text-sm font-light text-gray-300 tracking-wider">
                    {adminTab === "rsvps" && "Daftar Konfirmasi Buku Tamu & RSVP"}
                    {adminTab === "wishes" && "Pesan Ucapan, Doa Restu & Harapan"}
                    {adminTab === "broadcasts" && "Manajemen Antrean Sebar Undangan WA"}
                  </h3>
                  
                  <div className="relative flex items-center w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={adminSearchQuery}
                      onChange={(e) => setAdminSearchQuery(e.target.value)}
                      placeholder="Cari data di halaman ini..."
                      className="w-full pl-9 pr-3 py-1.5 bg-stone-900/60 border border-white/10 rounded-lg text-xs font-sans focus:outline-none focus:border-amber-500/40 text-white placeholder-gray-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Main Tab Lists Panel */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6">
                  
                  {/* TAB 1: RSVP List */}
                  {adminTab === "rsvps" && (
                    rsvps.filter(r => r.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || (r.note && r.note.toLowerCase().includes(adminSearchQuery.toLowerCase()))).length === 0 ? (
                      <p className="text-center py-20 text-xs text-gray-500 font-sans italic">
                        Tidak ada data RSVP ditemukan.
                      </p>
                    ) : (
                      <div className="bg-stone-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-stone-950 text-gray-400 uppercase text-[9px] tracking-wider border-b border-white/10 sticky top-0">
                            <tr>
                              <th className="px-5 py-3">Nama Tamu</th>
                              <th className="px-5 py-3">WhatsApp</th>
                              <th className="px-5 py-3">Status Kehadiran</th>
                              <th className="px-5 py-3 text-center">Pax (Orang)</th>
                              <th className="px-5 py-3">Catatan / Doa Singkat</th>
                              {currentUserRole === "admin" && (
                                <th className="px-5 py-3 text-right">Aksi</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-gray-300">
                            {rsvps
                              .filter(r => r.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || (r.note && r.note.toLowerCase().includes(adminSearchQuery.toLowerCase())))
                              .map((r) => (
                                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                                  <td className="px-5 py-3.5 font-medium text-white">{r.name}</td>
                                  <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px]">{r.phone || "-"}</td>
                                  <td className="px-5 py-3.5">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${
                                        r.attendance === "Hadir"
                                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                                      }`}
                                    >
                                      {r.attendance}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-center font-bold">
                                    {r.attendance === "Hadir" ? r.guestsCount : "-"}
                                  </td>
                                  <td className="px-5 py-3.5 text-gray-400 max-w-[200px] truncate" title={r.note}>
                                    {r.note || "-"}
                                  </td>
                                  {currentUserRole === "admin" && (
                                    <td className="px-5 py-3.5 text-right">
                                      <button
                                        onClick={() => handleDeleteRsvp(r.id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-400 hover:text-red-400 transition-colors cursor-pointer inline-flex items-center border border-transparent hover:border-red-500/15"
                                        title="Hapus RSVP"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}

                  {/* TAB 2: Wishes List */}
                  {adminTab === "wishes" && (
                    wishes.filter(w => w.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || w.message.toLowerCase().includes(adminSearchQuery.toLowerCase())).length === 0 ? (
                      <p className="text-center py-20 text-xs text-gray-500 font-sans italic">
                        Tidak ada data ucapan ditemukan.
                      </p>
                    ) : (
                      <div className="bg-stone-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-stone-950 text-gray-400 uppercase text-[9px] tracking-wider border-b border-white/10 sticky top-0">
                            <tr>
                              <th className="px-5 py-3">Nama Pengirim</th>
                              <th className="px-5 py-3">Hubungan</th>
                              <th className="px-5 py-3">Pesan Ucapan & Doa Restu</th>
                              <th className="px-5 py-3">Waktu Kirim</th>
                              {currentUserRole === "admin" && (
                                <th className="px-5 py-3 text-right">Aksi</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-gray-300">
                            {wishes
                              .filter(w => w.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || w.message.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                              .map((w) => (
                                <tr key={w.id} className="hover:bg-white/5 transition-colors">
                                  <td className="px-5 py-3.5 font-medium text-white">{w.name}</td>
                                  <td className="px-5 py-3.5">
                                    <span className="px-2 py-0.5 rounded bg-stone-950 text-[10px] text-amber-400/90 font-serif font-light italic">
                                      {w.relationship}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-gray-300 max-w-[320px] leading-relaxed whitespace-pre-line">
                                    {w.message}
                                  </td>
                                  <td className="px-5 py-3.5 text-gray-500 text-[10px]">{w.timestamp}</td>
                                  {currentUserRole === "admin" && (
                                    <td className="px-5 py-3.5 text-right">
                                      <button
                                        onClick={() => handleDeleteWish(w.id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-400 hover:text-red-400 transition-colors cursor-pointer inline-flex items-center border border-transparent hover:border-red-500/15"
                                        title="Hapus Ucapan"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}

                  {/* TAB 3: Broadcast Control Center */}
                  {adminTab === "broadcasts" && (
                    <div className="flex flex-col xl:flex-row gap-6 items-stretch">
                      
                      {/* Left: Input Form (Only viewable/submittable if Owner/Admin - always visible here but configured) */}
                      <div className="w-full xl:w-[380px] bg-stone-900 border border-white/10 rounded-xl p-5 shrink-0 flex flex-col h-fit">
                        <h4 className="font-serif text-sm font-light text-white mb-2 flex items-center gap-2 border-b border-white/5 pb-2.5">
                          <Plus className="w-4 h-4 text-amber-400" />
                          <span>Buat Undangan (Auto Sebar)</span>
                        </h4>
                        
                        <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                          Masukkan tamu di bawah untuk menyusun antrean. Tautan personalisasi undangan akan terbuat otomatis!
                        </p>

                        {/* Form Mode Selector */}
                        <div className="flex bg-stone-950 p-1 rounded-lg border border-white/5 mb-4 shrink-0">
                          <button
                            type="button"
                            onClick={() => setBroadcastFormMode("single")}
                            className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-sans font-bold rounded-md transition-all cursor-pointer ${
                              broadcastFormMode === "single"
                                ? "bg-amber-500 text-stone-950"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            Single / Satuan
                          </button>
                          <button
                            type="button"
                            onClick={() => setBroadcastFormMode("bulk")}
                            className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-sans font-bold rounded-md transition-all cursor-pointer ${
                              broadcastFormMode === "bulk"
                                ? "bg-amber-500 text-stone-950"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            Massal / Paste List
                          </button>
                        </div>

                        {broadcastFormMode === "single" ? (
                          <form onSubmit={handleAddSingleBroadcast} className="space-y-4">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                Nama Lengkap Tamu
                              </label>
                              <input
                                type="text"
                                required
                                value={singleGuestName}
                                onChange={(e) => setSingleGuestName(e.target.value)}
                                placeholder="Contoh: Bpk. Ahmad Fauzi & Istri"
                                className="w-full px-3.5 py-2 bg-stone-950 border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-amber-500/40 placeholder-gray-600 transition-colors"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                Nomor WhatsApp (Dengan Angka)
                              </label>
                              <input
                                type="text"
                                required
                                value={singleGuestPhone}
                                onChange={(e) => setSingleGuestPhone(e.target.value)}
                                placeholder="Contoh: 08123456789 atau 6281234..."
                                className="w-full px-3.5 py-2 bg-stone-950 border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-amber-500/40 placeholder-gray-600 transition-colors"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-white text-stone-950 text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-stone-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Kirim Ke Antrean Sebar</span>
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleAddBulkBroadcasts} className="space-y-4 flex-1 flex flex-col">
                            <div className="space-y-1.5 flex-1 flex flex-col">
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                List Input (Format: Nama - Nomor)
                              </label>
                              <textarea
                                required
                                value={bulkInputText}
                                onChange={(e) => setBulkInputText(e.target.value)}
                                placeholder="Budi Santoso - 08123456789&#10;Dr. Ahmad Fauzi - 08571234567&#10;Saras &amp; Pasangan - 628999888"
                                className="w-full h-44 p-3 bg-stone-950 border border-white/10 rounded-lg text-[10px] font-mono text-white focus:outline-none focus:border-amber-500/40 placeholder-gray-600 leading-relaxed resize-none no-scrollbar transition-colors"
                              />
                            </div>
                            
                            <button
                              type="submit"
                              className="w-full py-2.5 bg-white text-stone-950 text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-stone-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Proses &amp; Sebar Massal</span>
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Right: Queue List Table & Message Template Settings */}
                      <div className="flex-1 flex flex-col gap-6">
                        {/* Preset Message Setting (For Admin / Owner) */}
                        <div className="bg-stone-900 border border-white/10 rounded-xl p-5">
                          <details className="group" open={false}>
                            <summary className="list-none flex items-center justify-between cursor-pointer text-[10px] text-gray-300 uppercase tracking-wider font-bold">
                              <span className="flex items-center gap-2">
                                <Clipboard className="w-4 h-4 text-amber-400" />
                                <span>Template Pesan WhatsApp Broadcast</span>
                              </span>
                              <span className="text-[9px] text-amber-500/90 hover:text-amber-400 transition-colors group-open:hidden border border-amber-500/20 px-2 py-0.5 rounded">
                                Klik Untuk Edit Template
                              </span>
                              <span className="text-[9px] text-amber-500/90 hover:text-amber-400 transition-colors hidden group-open:inline border border-amber-500/20 px-2 py-0.5 rounded">
                                Simpan / Tutup Editor
                              </span>
                            </summary>
                            
                            <div className="mt-4 space-y-3 pt-3 border-t border-white/5">
                              <textarea
                                value={broadcastMessagePreset}
                                onChange={(e) => setBroadcastMessagePreset(e.target.value)}
                                className="w-full h-32 p-3 bg-stone-950 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500/40 leading-relaxed transition-colors"
                              />
                              <div className="p-3 bg-stone-950/50 rounded-lg border border-white/5 text-[9px] text-gray-500 space-y-1 leading-relaxed">
                                <p className="font-bold text-gray-400 uppercase">Tags Variabel Kunci:</p>
                                <p>• <code className="text-amber-400 font-mono font-semibold">{`{NAMA}`}</code> - Akan diganti otomatis dengan nama tamu.</p>
                                <p>• <code className="text-amber-400 font-mono font-semibold">{`{LINK}`}</code> - Tautan instan personalisasi dengan query parameter <code className="text-stone-300">?to=Nama+Tamu</code>.</p>
                              </div>
                            </div>
                          </details>
                        </div>

                        {/* Broadcast Queue List */}
                        <div className="bg-stone-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                          {broadcasts.filter(b => b.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || b.phone.includes(adminSearchQuery)).length === 0 ? (
                            <p className="text-center py-16 text-xs text-gray-500 font-sans italic">
                              Tidak ada antrean undangan sebar ditemukan.
                            </p>
                          ) : (
                            <table className="w-full text-left text-xs font-sans">
                              <thead className="bg-stone-950 text-gray-400 uppercase text-[9px] tracking-wider border-b border-white/10 sticky top-0">
                                <tr>
                                  <th className="px-5 py-3">Nama Penerima</th>
                                  <th className="px-5 py-3">WhatsApp</th>
                                  <th className="px-5 py-3 text-center">Status</th>
                                  <th className="px-5 py-3 text-right">Aksi</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 text-gray-300">
                                {broadcasts
                                  .filter(b => b.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || b.phone.includes(adminSearchQuery))
                                  .map((b) => (
                                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                                      <td className="px-5 py-3.5 font-medium text-white">
                                        <div>
                                          <p>{b.name}</p>
                                          <p className="text-[9px] text-gray-500 mt-0.5">Dibuat pada: {b.timestamp}</p>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3.5 text-gray-400 font-mono text-[11px]">{b.phone}</td>
                                      <td className="px-5 py-3.5 text-center">
                                        <span
                                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                            b.status === "Sudah Dikirim"
                                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                          }`}
                                        >
                                          {b.status}
                                        </span>
                                      </td>
                                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        {currentUserRole === "admin" ? (
                                          <div className="flex items-center justify-end gap-2">
                                            <button
                                              onClick={() => handleSendWhatsApp(b)}
                                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-bold font-sans tracking-wide uppercase flex items-center gap-1 transition-colors cursor-pointer"
                                              title="Kirim Pesan WA ke Tamu ini"
                                            >
                                              <Send className="w-3 h-3" />
                                              <span>Kirim WA</span>
                                            </button>
                                            
                                            <button
                                              onClick={() =>
                                                handleToggleBroadcastStatus(
                                                  b.id,
                                                  b.status === "Sudah Dikirim" ? "Belum Dikirim" : "Sudah Dikirim"
                                                )
                                              }
                                              className="p-1.5 hover:bg-white/5 border border-white/10 rounded-md text-gray-300 hover:text-white transition-all cursor-pointer"
                                              title={b.status === "Sudah Dikirim" ? "Tandai Belum Terkirim" : "Tandai Terkirim"}
                                            >
                                              <Check className="w-4 h-4" />
                                            </button>
                                            
                                            <button
                                              onClick={() => handleDeleteBroadcast(b.id)}
                                              className="p-1.5 hover:bg-red-500/10 border border-white/5 rounded-md text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                                              title="Hapus"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          /* Owner role can only delete if not sent yet */
                                          <div className="flex justify-end">
                                            <button
                                              onClick={() => handleDeleteBroadcast(b.id)}
                                              className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-400 hover:text-red-400 transition-colors cursor-pointer border border-transparent hover:border-red-500/15"
                                              title="Hapus Antrean"
                                              disabled={b.status === "Sudah Dikirim"}
                                              style={{ opacity: b.status === "Sudah Dikirim" ? 0.3 : 1 }}
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
