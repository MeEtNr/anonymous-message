"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: "#080810" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
          >
            A
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  return (
    <>
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
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .shimmer-text {
          background: linear-gradient(90deg,#a78bfa 0%,#818cf8 25%,#38bdf8 50%,#818cf8 75%,#a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),
            linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);
          background-size: 60px 60px;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(139,92,246,0.4);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(139,92,246,0.1), 0 0 0 1px rgba(139,92,246,0.05);
        }
        .cta-btn {
          background: linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);
          background-size: 200% auto;
          transition: all 0.4s ease;
          position: relative; overflow: hidden;
        }
        .cta-btn:hover {
          background-position: right center;
          box-shadow: 0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(14,165,233,0.15);
          transform: translateY(-2px) scale(1.01);
        }
        .badge-pill {
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.25);
          backdrop-filter: blur(10px);
        }
        .message-card {
          background: rgba(15,15,30,0.6);
          border: 1px solid rgba(139,92,246,0.2);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }
        .message-card:hover {
          border-color: rgba(139,92,246,0.5);
          box-shadow: 0 0 30px rgba(139,92,246,0.15);
        }
        @media (prefers-reduced-motion: reduce) {
          .glass-card:hover, .cta-btn:hover { transform: none; }
        }
      `}</style>

      <div
        className="flex h-screen overflow-hidden relative"
        style={{
          background: "radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 0%, rgba(14,165,233,0.1) 0%, transparent 50%), #080810"
        }}
      >
        {/* Background Overlays */}
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
        <div className="fixed inset-0 noise-overlay pointer-events-none z-0" />
        
        {/* Floating Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-3xl opacity-15" style={{ width:500, height:500, background:"radial-gradient(circle,#7c3aed,#4f46e5)", top:"-10%", left:"-5%", animation:"floatOrb 9s 0.5s ease-in-out infinite alternate" }} />
          <div className="absolute rounded-full blur-3xl opacity-10" style={{ width:400, height:400, background:"radial-gradient(circle,#0ea5e9,#06b6d4)", top:"40%", left:"85%", animation:"floatOrb 11s 2s ease-in-out infinite alternate" }} />
          <div className="absolute rounded-full blur-3xl opacity-10" style={{ width:350, height:350, background:"radial-gradient(circle,#8b5cf6,#a78bfa)", top:"70%", left:"10%", animation:"floatOrb 8s 1s ease-in-out infinite alternate" }} />
        </div>

        {/* Sidebar — manages desktop panel + mobile fixed topbar + mobile drawer */}
        <Sidebar className="z-20" />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          {/*
            Spacer for the mobile fixed top bar (height = py-3*2 + icon ~= 57px).
            Only visible on mobile; on desktop the sidebar occupies its own column.
          */}
          <div className="md:hidden h-[57px] shrink-0" />

          <div className="flex-1 overflow-y-auto">
            <div className="min-h-full pb-20">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
