"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Settings,
  LayoutGrid,
  Users,
  Brain,
  Building2,
  HelpCircle,
  LogOut,
  Send,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (path: string) => {
    setSelectedCard(path);
    setTimeout(() => {
      router.push(path);
    }, 500); // Wait for animation to finish
  };

  // Parallax / Hover tilt effect for all cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".glass-card");
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const rect = htmlCard.getBoundingClientRect();
        const cardX = (rect.left + rect.width / 2) / window.innerWidth - 0.5;
        const cardY = (rect.top + rect.height / 2) / window.innerHeight - 0.5;

        const factor = 15;
        const rotateX = (mouseY - cardY) * factor;
        const rotateY = (mouseX - cardX) * -factor;

        htmlCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    const handleMouseLeave = () => {
      const cards = document.querySelectorAll(".glass-card");
      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        htmlCard.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    alert(`Enviando prompt ao FZ AI Engine: "${prompt}"`);
    setPrompt("");
  };

  return (
    <div className="relative min-h-screen font-sans bg-transparent text-[#191c1e] select-none overflow-x-hidden">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-center px-8 md:px-[80px] h-20">
        <div className="bg-[#f8f9fb]/80 backdrop-blur-xl border border-slate-200/50 rounded-full px-8 py-2.5 flex items-center shadow-sm gap-2">
          <img
            src="/fzbuildsemfundo.png"
            alt="FZ Console"
            className="h-8 w-auto mr-6"
          />
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[#003d9b] border-b-2 border-[#003d9b] py-1 transition-colors"
              href="#"
            >
              Ecosystem
            </Link>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#003d9b] py-1 transition-colors"
              href="#"
            >
              Predictions
            </Link>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#003d9b] py-1 transition-colors"
              href="#"
            >
              Fleet
            </Link>
          </nav>
          <div className="ml-8 flex items-center gap-4 text-[#003d9b]">
            <Bell className="h-5 w-5 cursor-pointer hover:scale-110 duration-150 transition-transform" />
            <Settings className="h-5 w-5 cursor-pointer hover:scale-110 duration-150 transition-transform" />
          </div>
        </div>
      </header>

      {/* Side Navigation Bar (Anchored Right) */}
      <aside className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col items-center py-8 gap-8 z-40 bg-[#f3f4f6]/80 backdrop-blur-2xl w-20 rounded-2xl shadow-2xl border border-white/20 perspective-1000 translate-x-[80%] opacity-20 hover:translate-x-0 hover:opacity-100 transition-all duration-500 justify-center">
        <div className="flex flex-col items-center gap-6 w-full px-2 justify-center">
          {/* Active: Dashboard */}
          <Link
            href="/os"
            className="w-12 h-12 flex items-center justify-center bg-[#00e3fd]/20 text-[#00616d] rounded-xl scale-110 transition-all duration-300 hover:scale-110 shadow-sm border border-[#00e3fd]/40"
          >
            <LayoutGrid className="h-5 w-5" />
          </Link>

          <Link
            href="/os/projects"
            className="w-12 h-12 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:text-[#003d9b]"
          >
            <Users className="h-5 w-5" />
          </Link>

          <Link
            href="/os/crm"
            className="w-12 h-12 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:text-[#003d9b]"
          >
            <Brain className="h-5 w-5" />
          </Link>

          <Link
            href="/os/finance"
            className="w-12 h-12 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:text-[#003d9b]"
          >
            <Building2 className="h-5 w-5" />
          </Link>

          <div className="h-px w-8 bg-slate-300/40 my-2" />

          <Link
            href="/os/admin"
            className="w-12 h-12 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:text-[#003d9b]"
          >
            <HelpCircle className="h-5 w-5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-12 h-12 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Spatial Canvas */}
      <main className="relative min-h-screen pt-32 pb-28 px-8 flex items-center justify-center overflow-hidden">
        {/* Atmospheric Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#003d9b]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#006875]/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] grid grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN */}
          <div className="col-span-12 lg:col-span-3 space-y-8 flex flex-col justify-center">
            {/* Projects Panel */}
            <motion.div
              layoutId="/os/projects"
              onClick={() => handleCardClick("/os/projects")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5 transition-transform duration-500 transform -rotate-1 hover:rotate-0 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b]">
                  PROJECTS
                </h3>
                <div className="w-2 h-2 rounded-full bg-[#006875] animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                    <span>Core Engine</span>
                    <span className="text-slate-400">42 - 312</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#003d9b] w-[75%] rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                    <span>Spatial UI</span>
                    <span className="text-slate-400">68 - 42</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00e3fd] w-[45%] rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                    <span>AI Dataset</span>
                    <span className="text-slate-400">15 - 13</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#003d9b] w-[90%] rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Team Activity */}
            <motion.div
              layoutId="/os/team"
              onClick={() => handleCardClick("/os/team")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5 transition-transform duration-500 transform rotate-1 hover:rotate-0 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] mb-6">
                TEAM ACTIVITY
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhlwfUzpRuULSHyCEvL0c58ubtnS1mLM0mJtRoEVLcLFM0eohVCs42xe1DaNk-SxII1DVNgQydcZnp9xU4R6WTfIV9C3FTjsnfIk080IzfE8-VlpWE-skXKykqP3inrAOphdnuSZjYrjYNuKAIQRubAeIJKphsOUiSoGfJ-am660FM_u9TSWbNYUFKw7rJUvkr9bg6_Yy2mgl-0qM7o9J_5AFSf0kAj8c9rZEk4g2CwpuJFzl_QDZ0"
                    alt="Engineer 1"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">
                      Active
                    </span>
                    <span className="text-[10px] text-slate-400">Status</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwhXgttIXq0vOzGTr4aGClKqxPJeIUDMEOxFLjuoAy4mCN9SJ-yyihB6qG7JQWKhaY9rWl3rnWu60cVITRU9JsRHLtjw4oP1IZcoQTAEwxZydgbrRyot7TTuKncaTewuPrys_u-Vg_wo4kE9U1aCmoIZPhXoWaxV-f_bk0x1obX6jIvbjE56jfyU8z8hebjtksoe7S-VKFBVET3Zdv3UIXPnVptYaI74TnQaYS2EMixjvYPoDyRPls"
                    alt="Engineer 2"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">
                      Idle
                    </span>
                    <span className="text-[10px] text-slate-400">Status</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwOKrdy4iNYPdoY2J-3ZTDfYnGbsvCR5_pcguT4b4j3ljKDH_cEFhJyyVXGdvGkY8dehvEsArdT1Lsq1T4si8TKgY5rhrcZdFSJBxYq-AV14vYg59D5QhvJzEJ74APLjj-9GsBRESWSGsc0ZqVsSDD5DJK1YyME-72fwgQVqMwyna2_aleZBEAmmzwKvEBOvf9tVpZ2g34lRsfX1ib1H8Sr9lVpOyFcEihFmOutE6KSRSkF70ISIRd"
                    alt="Designer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">
                      Busy
                    </span>
                    <span className="text-[10px] text-slate-400">Status</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZa_ztu8y4ao3gg8RvnWmyRqL7zNtLk-7Uq7fw4D_fItMqWDQrF6KC4MO-bf-rYJR_Pt9GkMcvE1EG6zf8KUwmdjaf8y3pvlONmxpkoHx7LlimNAhWPX-XW1vLcE9U-31BWeluTQTjrV3PrEklhIxX-JX6G7RtwBVGJOHQoN8UBZaIHUThcK5WkINRwBO9_btBOk8D9WbVUsbNaPYGeY_8wabQr-NmvBb4mzu0lXp87S4HApGX-5y1"
                    alt="Lead"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">
                      Offline
                    </span>
                    <span className="text-[10px] text-slate-400">Status</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Workflow Visualization Bottom */}
            <motion.div
              layoutId="/os/workflow-viz"
              onClick={() => handleCardClick("/os/workflow")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl h-48 flex flex-col shadow-xl shadow-blue-900/5 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] mb-2">
                WORKFLOW VISUALIZATION
              </h3>
              <div className="flex-grow flex items-end">
                <div className="w-full h-full relative overflow-hidden" />
              </div>
            </motion.div>
          </div>

          {/* CENTRAL HUB */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center relative">
            {/* Large Rotating Orb Background */}
            <div className="absolute w-[600px] h-[600px] rounded-full border border-blue-900/10 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#003d9b] rounded-full blur-sm" />
              </div>
            </div>

            {/* Main AI Command Circle */}
            <div
              className="w-[520px] h-[520px] rounded-full bg-white/70 backdrop-blur-lg glass-card border border-white/45 flex flex-col items-center justify-center p-12 text-center relative z-20 shadow-2xl shadow-blue-900/15"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div className="mb-6 flex flex-col items-center select-none">
                <div className="w-16 h-16 bg-[#003d9b] rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl mb-4 shadow-lg shadow-blue-900/25">
                  FZ
                </div>
                <h2 className="font-heading text-[28px] font-extrabold tracking-tight leading-tight text-slate-800 uppercase">
                  AI COMMAND CENTER
                </h2>
              </div>

              {/* AI Input Field */}
              <form onSubmit={handleSendPrompt} className="w-full mb-8">
                <div className="relative group">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe project workflow for deployment..."
                    className="w-full bg-[#f3f4f6]/80 border border-slate-200 px-6 py-4 rounded-full text-sm font-sans focus:ring-2 focus:ring-[#00e3fd]/50 focus:border-[#00e3fd] outline-none transition-all pr-12 shadow-inner text-slate-800 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003d9b] hover:scale-110 transition-transform duration-200"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Charts Grid */}
              <div className="grid grid-cols-2 gap-8 w-full select-none">
                <div className="flex flex-col items-center">
                  <div className="w-full h-24 mb-2 bg-[#f8f9fb] rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 font-mono text-xs">
                    Insights Graph
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AI INSIGHTS
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full h-24 mb-2 bg-[#f8f9fb] rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 font-mono text-xs">
                    Predict Map
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    PREDICTIONS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-3 space-y-8 flex flex-col justify-center">
            {/* Workflow Nodes */}
            <motion.div
              layoutId="/os/workflow"
              onClick={() => handleCardClick("/os/workflow")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 h-64 overflow-hidden relative shadow-xl shadow-blue-900/5 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] mb-4">
                WORKFLOW VISUALIZATION
              </h3>
              <div className="w-full h-full flex items-center justify-center select-none">
                <div
                  className="w-full h-full bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3x5MISy9r_yq-GzGvmKV0gRUUThH0TGhvnF7T4uxXsUPdAaidgQD2PNWxI2vvogXSmxqWD6yFwV_72ljVWbzAEW3cDowBK_I9PAyFy9buovTZkFu5olHU8lzMAZoHtYpjLFgjJKQMD-e2edaI1dR163NhSgdAgxbVf3zed1_lGnpa1C7R858GJz6OltHvltxVRHT_xBFuxjko-zA4__kR4rFczy9TU1GyULUhGQ9oIc49jYbDgGQE')",
                  }}
                />
              </div>
            </motion.div>

            {/* Infrastructure Map */}
            <motion.div
              layoutId="/os/infrastructure"
              onClick={() => handleCardClick("/os/infrastructure")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 h-72 shadow-xl shadow-blue-900/5 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] mb-4">
                INFRASTRUCTURE MAP
              </h3>
              <div className="w-full h-full relative select-none">
                {/* Wireframe Mesh Background */}
                <div
                  className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-55 pointer-events-none"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDs8dTuDWWZ_aBVawpCmlXCHIFfuxlJE3E15uQQaNiot1DvWAoDGqgcW6CQcP726pPF9T-n7dJNGXmE1TmHhTIOEKdEAmLXIxZeJoPy6lnQo2clWokl9ad5D_28rzeSr3InPJA2Ix0dw9F2tOOEwAplTQAv5Y4J-U0YeOM7K12sPTlx3WLZk7DXkpZRYOhqsgefdcUBXq4bWYu4Pq8teO04mzeSNTrXm1a5qyU0Tw-uHgwTByET-Jtr')",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Bottom Action Anchor (FAB) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={() => alert("Abrindo modal de novo workflow espacial...")}
          className="bg-[#003d9b] hover:bg-[#003280] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-900/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm font-sans"
        >
          <Plus className="h-5 w-5" />
          <span>New Spatial Workflow</span>
        </button>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            layoutId={
              selectedCard === "/os/workflow" && selectedCard
                ? "/os/workflow"
                : selectedCard
            }
            className="fixed inset-0 z-[100] bg-white"
            initial={{ borderRadius: 24, opacity: 0.8 }}
            animate={{ borderRadius: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
