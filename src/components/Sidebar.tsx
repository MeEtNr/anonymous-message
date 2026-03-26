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
  MoreVertical,
  LogOut,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Question } from "@/models/User";
import type { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
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

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-questions");
      console.log("DEBUG: Questions fetched in sidebar:", response.data.questions?.map(q => ({ content: q.content, _id: q._id })));
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchQuestions();
    }
  }, [session, fetchQuestions, pathname]);

  const NavItem = ({ 
    href, 
    icon: Icon, 
    children, 
    active 
  }: { 
    href: string; 
    icon: any; 
    children: React.ReactNode; 
    active?: boolean;
  }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
        active 
          ? "bg-slate-200 text-slate-900" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span className="truncate">{children}</span>}
    </Link>
  );

  return (
    <aside 
      className={cn(
        "h-screen bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <span className="font-bold text-xl text-blue-700 truncate">
            AnnoMessage
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-slate-500 hidden md:inline-flex"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="px-3 mb-4">
        <Button 
          className={cn(
            "w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white",
            isCollapsed && "px-0 justify-center"
          )}
          asChild
        >
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-6">
          {!isCollapsed && <p className="text-xs font-semibold text-slate-400 uppercase mb-2 px-3">General</p>}
          <NavItem 
            href="/dashboard/inbox" 
            icon={Inbox} 
            active={pathname === "/dashboard/inbox"}
          >
            General Inbox
          </NavItem>
          {session?.user?.role === "admin" && (
            <NavItem 
              href="/admin/dashboard" 
              icon={ShieldCheck} 
              active={pathname.startsWith("/admin")}
            >
              Admin Panel
            </NavItem>
          )}
        </div>

        <div>
          {!isCollapsed && <p className="text-xs font-semibold text-slate-400 uppercase mb-2 px-3">Threads</p>}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="space-y-1">
              {questions.map((question) => (
                <NavItem
                  key={question._id as string}
                  href={`/dashboard/question/${question._id}`}
                  icon={MessageSquare}
                  active={pathname === `/dashboard/question/${question._id}`}
                >
                  {question.content}
                </NavItem>
              ))}
              {!isLoading && questions.length === 0 && !isCollapsed && (
                <p className="text-xs text-slate-400 px-3 py-2 italic text-center">
                  No threads yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200">
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer",
          isCollapsed && "justify-center"
        )}>
          <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
            {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <p className="text-slate-900 font-semibold truncate">
                {session?.user?.name || session?.user?.email?.split('@')[0]}
              </p>
            </div>
          )}
          {!isCollapsed && (
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => signOut()}
              >
               <LogOut className="h-4 w-4" />
             </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
