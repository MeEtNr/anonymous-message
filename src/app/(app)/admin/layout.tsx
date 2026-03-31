"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Menu, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden relative">
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes floatOrb {
          0%   { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .shimmer-text {
          background: linear-gradient(90deg,#a78bfa 0%,#818cf8 25%,#38bdf8 50%,#818cf8 75%,#a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .cta-btn {
          background: linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);
          background-size: 200% auto;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-btn:hover {
          background-position: right center;
          box-shadow: 0 0 30px rgba(124,58,237,0.4);
          transform: translateY(-1px);
        }
        .badge-pill {
           background: rgba(139,92,246,0.15);
           backdrop-filter: blur(8px);
           border: 1px solid rgba(139,92,246,0.25);
        }
      `}</style>
      
      {/* ── BACKGROUND LAYERS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Radial Gradients */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.1) 0%, transparent 50%)"
        }} />
        
        {/* Dot Grid */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: "radial-gradient(circle, #8b5cf6 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        
        {/* Noise Texture Over */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
        
        {/* Floating Orbs */}
        <div className="absolute rounded-full blur-[100px] opacity-20" style={{ width:500, height:500, background:"radial-gradient(circle,#7c3aed,#4f46e5)", top:"-10%", left:"-5%", animation:"floatOrb 15s ease-in-out infinite alternate" }} />
        <div className="absolute rounded-full blur-[100px] opacity-10" style={{ width:400, height:400, background:"radial-gradient(circle,#0ea5e9,#06b6d4)", bottom:"10%", right:"5%", animation:"floatOrb 20s 2s ease-in-out infinite alternate-reverse" }} />
      </div>

      {/* ── SIDEBAR ── */}
      <Sidebar className="hidden md:flex border-r border-white/5 relative z-10" />

      {/* ── MAIN CONTENT Area ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl flex items-center px-6 shrink-0 z-50">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5 text-slate-400 rounded-xl">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] border-r border-white/5 bg-slate-950/90 backdrop-blur-2xl">
              <Sidebar className="w-full border-none" />
            </SheetContent>
          </Sheet>
          <div className="ml-4 flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-900/20">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-xl text-white tracking-tight">Admin</span>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto relative">
           <div className="min-h-full pb-20">
            {children}
           </div>
        </div>
      </main>
    </div>
  );
}
