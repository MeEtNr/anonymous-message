"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Floating orb component
function FloatingOrb({
  size,
  color,
  top,
  left,
  delay,
  duration,
}: {
  size: number;
  color: string;
  top: string;
  left: string;
  delay: string;
  duration: string;
}) {
  return (
    <div
      className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
        animation: `floatOrb ${duration} ${delay} ease-in-out infinite alternate`,
      }}
    />
  );
}

// Animated stat counter
function StatCounter({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = value / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center group">
      <div
        className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent mb-2"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #38bdf8 100%)",
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm sm:text-base font-medium text-slate-400 tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
}

const features = [
  {
    icon: "🔗",
    title: "Your Personal Link",
    description:
      "Get a unique, shareable link in seconds. Post it on your bio, socials, or anywhere — anyone can send you anonymous feedback.",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/10",
  },
  {
    icon: "🎭",
    title: "Truly Anonymous",
    description:
      "Senders stay 100% anonymous. No login required for them — just click, type, and send. Honest feedback without awkwardness.",
    gradient: "from-sky-500/20 to-cyan-500/10",
    border: "border-sky-500/30",
    glow: "shadow-sky-500/10",
  },
  {
    icon: "💬",
    title: "Real Honest Feedback",
    description:
      "Unlock the truth. Anonymity removes fear — get the candid opinions, reviews, and thoughts people never say in person.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/10",
  },
  {
    icon: "📬",
    title: "Inbox Dashboard",
    description:
      "All your anonymous messages in one clean, organized dashboard. Read, manage, and respond to feedback at your own pace.",
    gradient: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/30",
    glow: "shadow-pink-500/10",
  },
  {
    icon: "🔐",
    title: "Privacy First",
    description:
      "We never expose sender identities. Your inbox is yours alone — protected by design, not just policy.",
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/10",
  },
  {
    icon: "⚡",
    title: "Instant & Effortless",
    description:
      "Sign up, copy your link, share it — messages start arriving immediately. No complex setup, no waiting.",
    gradient: "from-indigo-500/20 to-blue-500/10",
    border: "border-indigo-500/30",
    glow: "shadow-indigo-500/10",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes floatOrb {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(139, 92, 246, 0.3); }
          50% { border-color: rgba(139, 92, 246, 0.8); }
        }
        .hero-title {
          animation: slideUp 0.8s 0.2s ease both;
        }
        .hero-subtitle {
          animation: slideUp 0.8s 0.4s ease both;
        }
        .hero-cta {
          animation: slideUp 0.8s 0.6s ease both;
        }
        .hero-carousel {
          animation: fadeInScale 0.9s 0.8s ease both;
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #a78bfa 0%,
            #818cf8 25%,
            #38bdf8 50%,
            #818cf8 75%,
            #a78bfa 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(139, 92, 246, 0.4);
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1);
        }
        .cta-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%);
          background-size: 200% auto;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .cta-btn:hover {
          background-position: right center;
          box-shadow: 0 0 40px rgba(124, 58, 237, 0.5), 0 0 80px rgba(14, 165, 233, 0.2);
          transform: translateY(-2px) scale(1.02);
        }
        .cta-btn:hover::after {
          opacity: 1;
        }
        .message-card {
          background: rgba(15, 15, 30, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }
        .message-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.1);
        }
        .feature-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .stat-divider {
          height: 60px;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.5), transparent);
        }
        .grid-bg {
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
        .badge-pill {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.35);
          backdrop-filter: blur(10px);
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-text { animation: none; }
          .cta-btn:hover { transform: none; }
          .glass-card:hover { transform: none; }
          .feature-card:hover { transform: none; }
        }
      `}</style>

      <main
        className="min-h-screen overflow-x-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 0%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), #080810",
        }}
      >
        {/* Grid Background */}
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
        <div className="fixed inset-0 noise-overlay pointer-events-none z-0" />

        {/* Floating Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <FloatingOrb
            size={600}
            color="radial-gradient(circle, #7c3aed, #4f46e5)"
            top="-15%"
            left="-10%"
            delay="0s"
            duration="8s"
          />
          <FloatingOrb
            size={500}
            color="radial-gradient(circle, #0ea5e9, #06b6d4)"
            top="10%"
            left="70%"
            delay="2s"
            duration="10s"
          />
          <FloatingOrb
            size={400}
            color="radial-gradient(circle, #8b5cf6, #a78bfa)"
            top="60%"
            left="80%"
            delay="4s"
            duration="12s"
          />
          <FloatingOrb
            size={350}
            color="radial-gradient(circle, #ec4899, #f43f5e)"
            top="70%"
            left="-5%"
            delay="1s"
            duration="9s"
          />
        </div>

        {/* ── HERO SECTION ─────────────────────────────── */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          {/* Badge */}
          <div className="hero-title badge-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-violet-300 mb-8 tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            Anonymous Feedback Platform
          </div>

          {/* Headline */}
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-6">
            <span className="text-white block">Get Honest Feedback,</span>
            <span className="shimmer-text block">Anonymously.</span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-subtitle max-w-2xl text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed mb-10 font-light">
            Generate your personal{" "}
            <span className="text-violet-400 font-medium">anonymous feedback link</span>,
            share it anywhere, and let anyone send you their raw, honest thoughts — no
            sign-in needed on their end.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row gap-4 mb-20">
            <button
              onClick={() => router.replace("/sign-up")}
              className="cta-btn text-white font-semibold px-8 py-4 rounded-2xl text-base sm:text-lg tracking-wide shadow-2xl"
            >
              Generate My Link →
            </button>
            <button
              onClick={() => router.replace("/sign-in")}
              className="glass-card px-8 py-4 rounded-2xl text-base sm:text-lg font-semibold text-slate-200 tracking-wide hover:text-white"
            >
              Sign In
            </button>
          </div>

          {/* Social proof */}
          <div className="hero-cta flex items-center gap-3 opacity-60">
            <div className="flex -space-x-2">
              {["#7c3aed","#0ea5e9","#10b981","#f59e0b"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#080810] flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}
                >
                  {["A","B","C","D"][i]}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-white font-semibold">18,000+</span> links generated
            </p>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="text-xs text-slate-500 tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-violet-500 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── STATS SECTION ────────────────────────────── */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="glass-card rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-around gap-8 sm:gap-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <StatCounter value={120000} label="Feedbacks Collected" suffix="+" />
              <div className="stat-divider hidden sm:block" />
              <StatCounter value={18000} label="Links Generated" suffix="+" />
              <div className="stat-divider hidden sm:block" />
              <StatCounter value={99} label="Sender Anonymity" suffix="%" />
            </div>
          </div>
        </section>

        {/* ── CAROUSEL SECTION ─────────────────────────── */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4">
              Live Preview
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Feedback flowing{" "}
              <span className="shimmer-text">in real-time</span>
            </h2>
            <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-xl mx-auto">
              A glimpse of what lands in your inbox when you share your link.
            </p>
          </div>

          <div className="hero-carousel w-full max-w-xl mx-auto">
            <Carousel
              plugins={[Autoplay({ delay: 2500 })]}
              opts={{ loop: true }}
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem
                    key={index}
                    className="flex justify-center items-center"
                  >
                    <div className="p-3 w-full">
                      <div className="message-card rounded-3xl p-6 sm:p-8 w-full">
                        {/* Avatar placeholder */}
                        <div className="flex items-center gap-3 mb-5">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                            }}
                          >
                            ?
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-violet-300">
                              {message.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {message.received}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <span className="text-xs badge-pill px-3 py-1 rounded-full text-violet-400">
                              anonymous
                            </span>
                          </div>
                        </div>
                        <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed pl-1">
                          "{message.content}"
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-14 bg-transparent border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 hover:border-violet-400" />
              <CarouselNext className="hidden sm:flex -right-14 bg-transparent border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 hover:border-violet-400" />
            </Carousel>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4">
                Simple Process
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                Up and running in{" "}
                <span className="shimmer-text">3 steps</span>
              </h2>
              <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-lg mx-auto">
                No complex setup. Share your link, sit back, and watch honest feedback roll in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div
                className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
                }}
              />

              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  desc: "Sign up in seconds with your email. No credit card — free forever.",
                  color: "#7c3aed",
                },
                {
                  step: "02",
                  title: "Copy & Share Your Link",
                  desc: "Get a unique personal link. Share it on Instagram bio, Twitter, WhatsApp, or anywhere online.",
                  color: "#0ea5e9",
                },
                {
                  step: "03",
                  title: "Collect Anonymous Feedback",
                  desc: "Anyone with your link can send you honest feedback — no account needed on their end.",
                  color: "#10b981",
                },
              ].map(({ step, title, desc, color }) => (
                <div key={step} className="flex flex-col items-center text-center group">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-2xl font-black text-white mb-6 relative transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                      border: `1px solid ${color}40`,
                      boxShadow: `0 0 40px ${color}20`,
                    }}
                  >
                    <span style={{ color }}>{step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xs">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ────────────────────────────── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-violet-400 uppercase mb-4">
                Platform Features
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Everything you <span className="shimmer-text">need</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
                Built so you can collect genuine, unfiltered feedback from anyone — effortlessly and anonymously.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon, title, description, gradient, border, glow }) => (
                <div
                  key={title}
                  className={`feature-card glass-card rounded-3xl p-7 shadow-xl ${glow}`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} border ${border} flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110`}
                  >
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA BANNER ─────────────────────────── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-[2.5rem] p-12 sm:p-16 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(79,70,229,0.2) 50%, rgba(14,165,233,0.2) 100%)",
                border: "1px solid rgba(139,92,246,0.4)",
                boxShadow:
                  "0 0 80px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.2) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <div className="text-5xl mb-6">🔗</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Generate your link,{" "}
                  <span className="shimmer-text">start collecting.</span>
                </h2>
                <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-lg mx-auto font-light">
                  Join thousands of creators, students, and professionals who use anonymous
                  feedback to grow, improve, and understand what people{" "}
                  <em>really</em> think.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => router.replace("/sign-up")}
                    className="cta-btn text-white font-bold px-10 py-4 rounded-2xl text-base sm:text-lg tracking-wide shadow-2xl w-full sm:w-auto"
                  >
                    Generate My Link →
                  </button>
                  <p className="text-slate-500 text-sm">
                    Free forever • No credit card • Instant setup
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom fade */}
        <div
          className="relative z-10 h-20"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,16,0.8), transparent)",
          }}
        />
      </main>
    </>
  );
}
