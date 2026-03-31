"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Inbox,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "@/models/User";
import type { ApiResponse } from "@/types/ApiResponse";
import { signOut } from "next-auth/react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close drawer when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-questions");
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) fetchQuestions();
  }, [session, fetchQuestions, pathname]);

  // ── Nav Item ─────────────────────────────────────────────────
  const NavItem = ({
    href,
    icon: Icon,
    label,
    active,
    collapsed,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    active?: boolean;
    collapsed?: boolean;
  }) => (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex items-center rounded-xl text-sm font-medium transition-all duration-200 mb-1 relative overflow-hidden",
        collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
      )}
      style={
        active
          ? {
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(14,165,233,0.15))",
              border: "1px solid rgba(139,92,246,0.35)",
              boxShadow: "0 0 16px rgba(124,58,237,0.12)",
              color: "white",
            }
          : {
              background: "transparent",
              border: "1px solid transparent",
              color: "#94a3b8",
            }
      }
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "rgba(139,92,246,0.08)";
          el.style.borderColor = "rgba(139,92,246,0.2)";
          el.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "transparent";
          el.style.borderColor = "transparent";
          el.style.color = "#94a3b8";
        }
      }}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active
             ? "text-violet-400"
             : "text-slate-500 group-hover:text-violet-400"
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
          style={{ background: "linear-gradient(to bottom, #7c3aed, #0ea5e9)" }}
        />
      )}
    </Link>
  );

  // ── Shared sidebar inner content ──────────────────────────────
  const SidebarContent = ({
    collapsed,
    onClose,
  }: {
    collapsed: boolean;
    onClose?: () => void; // only needed for mobile drawer
  }) => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          "flex items-center px-4 py-6 shrink-0 transition-all duration-500",
          collapsed ? "flex-col gap-6" : "justify-between"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 shadow-lg shadow-violet-950/20 transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
          >
            A
          </div>
          {!collapsed && (
            <span className="shimmer-text font-black text-xl tracking-tight truncate">
              AnnoMessage
            </span>
          )}
        </div>

        {/* Desktop collapse / Mobile close button */}
        {onClose ? (
          // Mobile: show X button
          <button
            className="collapse-btn ml-auto"
            onClick={onClose}
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          // Desktop: show collapse toggle
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="sidebar-divider mx-4 mb-3 shrink-0" />

      {/* Dashboard CTA */}
      <div className="px-4 mb-5 shrink-0">
        <Link href="/dashboard">
          <button
            className="sidebar-dashboard-btn h-12"
            style={collapsed ? { justifyContent: "center", padding: "0.5rem", borderRadius: "14px" } : { borderRadius: "14px" }}
            title={collapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="font-bold">Dashboard</span>}
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {/* General */}
        <div className="mb-6">
          {!collapsed && <p className="sidebar-section-label">General</p>}
          <NavItem
            href="/dashboard/inbox"
            icon={Inbox}
            label="Messages Inbox"
            active={pathname === "/dashboard/inbox"}
            collapsed={collapsed}
          />
          {session?.user?.role === "admin" && (
            <NavItem
              href="/admin/dashboard"
              icon={ShieldCheck}
              label="Admin Panel"
              active={pathname.startsWith("/admin")}
              collapsed={collapsed}
            />
          )}
        </div>

        {/* Threads */}
        <div>
          {!collapsed && <p className="sidebar-section-label">Threads</p>}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
            </div>
          ) : (
            <div className="space-y-1">
              {questions.map((question) => (
                <NavItem
                  key={question._id as string}
                  href={`/dashboard/question/${question._id}`}
                  icon={MessageSquare}
                  label={question.content}
                  active={pathname === `/dashboard/question/${question._id}`}
                  collapsed={collapsed}
                />
              ))}
              {!isLoading && questions.length === 0 && !collapsed && (
                <p className="text-xs text-slate-600 px-3 py-3 italic text-center">
                   No threads created
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer — user + logout */}
      <div className="px-4 pb-6 pt-3 shrink-0">
        <div className="sidebar-divider mb-5" />
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-2.5 rounded-[18px] transition-all",
            collapsed ? "justify-center" : "bg-white/5 border border-white/5"
          )}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 shadow-xl shadow-slate-950/40"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
          >
            {(
              session?.user?.name?.[0] ||
              session?.user?.email?.[0] ||
              "U"
            ).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate">
                {session?.user?.name || session?.user?.email?.split("@")[0]}
              </p>
              <p className="text-[10px] uppercase font-black text-slate-600 truncate tracking-wider">
                 {session?.user?.email || "Member"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-rose-500/20 transition-all"
              onClick={() => signOut()}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text, .sidebar-shimmer {
          background: linear-gradient(90deg, #a78bfa 0%, #818cf8 25%, #38bdf8 50%, #818cf8 75%, #a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .sidebar-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
        }
        .sidebar-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #475569;
          padding: 0 0.75rem;
          margin-bottom: 0.375rem;
        }
        .collapse-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 0.5rem;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          background: rgba(139,92,246,0.2);
          border-color: rgba(139,92,246,0.4);
          color: white;
        }
        .sidebar-footer-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 0.5rem;
          background: transparent;
          border: 1px solid transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .sidebar-footer-btn:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #f87171;
        }
        .sidebar-dashboard-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: 0.875rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          letter-spacing: 0.02em;
          background: linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);
          background-size: 200% auto;
          border: none;
          cursor: pointer;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }
        .sidebar-dashboard-btn:hover {
          background-position: right center;
          box-shadow: 0 0 20px rgba(124,58,237,0.4);
          transform: translateY(-1px);
        }
        .mobile-menu-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          color: #c4b5fd;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .mobile-menu-btn:hover {
          background: rgba(139,92,246,0.2);
          border-color: rgba(139,92,246,0.4);
          color: white;
        }
      `}</style>

      <aside
        className={cn(
          "hidden md:flex h-screen flex-col flex-shrink-0 transition-all duration-500",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          className
        )}
        style={{
          background: "rgba(8,8,16,0.5)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* ── MOBILE: fixed top bar (< md) ─────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(10,10,22,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
          >
            A
          </div>
          <span className="sidebar-shimmer font-black text-lg tracking-tight leading-none">
            AnnoMessage
          </span>
        </div>

        {/* Spacer to centre the logo */}
        <div className="w-9" />
      </div>

      {/* ── MOBILE: overlay + slide-in drawer ────────── */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              animation: "fadeIn 0.2s ease",
            }}
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer */}
          <div
            className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] flex flex-col"
            style={{
              background: "rgba(8,8,16,0.8)",
              backdropFilter: "blur(24px)",
              borderRight: "1px solid rgba(139,92,246,0.2)",
              animation: "slideUp 0.3s ease",
            }}
          >
            <SidebarContent
              collapsed={false}
              onClose={() => setIsMobileOpen(false)}
            />
          </div>
        </>
      )}
    </>
  );
}
