"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldCheck, LogOut, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Deepen navbar bg on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not show the main navbar on dashboard and admin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .logo-shimmer {
          background: linear-gradient(90deg,#a78bfa 0%,#818cf8 25%,#38bdf8 50%,#818cf8 75%,#a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .navbar-glass {
          background: rgba(8,8,16,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139,92,246,0.12);
          transition: all 0.3s ease;
        }
        .navbar-glass.scrolled {
          background: rgba(8,8,16,0.85);
          border-bottom-color: rgba(139,92,246,0.25);
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
        }
        .nav-cta {
          background: linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);
          background-size: 200% auto;
          transition: all 0.35s ease;
          position: relative; overflow: hidden;
          padding: 0.5rem 1.25rem;
          border-radius: 0.875rem;
          font-weight: 600;
          font-size: 0.875rem;
          color: white;
          letter-spacing: 0.02em;
          border: none; cursor: pointer;
          white-space: nowrap;
        }
        .nav-cta::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);
          opacity:0; transition:opacity 0.3s ease;
        }
        .nav-cta:hover {
          background-position: right center;
          box-shadow: 0 0 24px rgba(124,58,237,0.45), 0 0 48px rgba(14,165,233,0.15);
          transform: translateY(-1px) scale(1.02);
        }
        .nav-cta:hover::after { opacity:1; }
        .nav-ghost-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8;
          border: 1px solid rgba(139,92,246,0.15);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .nav-ghost-btn:hover {
          color: white;
          border-color: rgba(139,92,246,0.4);
          background: rgba(139,92,246,0.08);
        }
        .badge-pill {
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.3);
          backdrop-filter: blur(10px);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #c4b5fd;
        }
        .sheet-glass {
          background: #0d0d1a !important;
          border-left: 1px solid rgba(139,92,246,0.2) !important;
        }
        .mobile-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent);
        }
      `}</style>

      <nav className={`navbar-glass fixed top-0 left-0 right-0 z-50 ${scrolled ? "scrolled" : ""}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
            >
              A
            </div>
            <span className="text-xl font-black tracking-tight logo-shimmer">
              AnnoMessage
            </span>
          </Link>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {/* User greeting */}
                <div className="badge-pill">
                  <span className="text-slate-400">Hey, </span>
                  <span className="text-violet-300 font-semibold">
                    {user?.username || user?.email}
                  </span>
                </div>

                {/* Admin link */}
                {user?.role === "admin" && (
                  <Link href="/admin/dashboard">
                    <button className="nav-ghost-btn">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Admin
                    </button>
                  </Link>
                )}

                {/* Dashboard */}
                <Link href="/dashboard">
                  <button className="nav-ghost-btn">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </button>
                </Link>

                {/* Logout */}
                <button
                  className="nav-ghost-btn"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <button className="nav-ghost-btn">Sign in</button>
                </Link>
                <Link href="/sign-up">
                  <button className="nav-cta">Get Started →</button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="nav-ghost-btn p-2">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="sheet-glass w-72 px-6 py-8">
                {/* Mobile logo */}
                <div className="flex items-center gap-2 mb-8">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
                  >
                    A
                  </div>
                  <span className="text-xl font-black tracking-tight logo-shimmer">
                    AnnoMessage
                  </span>
                </div>

                <div className="mobile-divider mb-6" />

                <div className="flex flex-col gap-3">
                  {session ? (
                    <>
                      {/* User greeting */}
                      <div className="badge-pill w-fit mb-2">
                        <span className="text-slate-400">Hey, </span>
                        <span className="text-violet-300 font-semibold">
                          {user?.username || user?.email}
                        </span>
                      </div>

                      {/* Admin */}
                      {user?.role === "admin" && (
                        <Link href="/admin/dashboard">
                          <button className="nav-ghost-btn w-full justify-start">
                            <ShieldCheck className="h-4 w-4" />
                            Admin Panel
                          </button>
                        </Link>
                      )}

                      {/* Dashboard */}
                      <Link href="/dashboard">
                        <button className="nav-ghost-btn w-full justify-start">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </button>
                      </Link>

                      <div className="mobile-divider my-2" />

                      {/* Logout */}
                      <button
                        className="nav-ghost-btn w-full justify-start"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/sign-in">
                        <button className="nav-ghost-btn w-full justify-center">
                          Sign in
                        </button>
                      </Link>
                      <Link href="/sign-up">
                        <button className="nav-cta w-full text-center">
                          Get Started →
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-[57px]" />
    </>
  );
};

export default Navbar;
