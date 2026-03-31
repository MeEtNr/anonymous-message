"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Copy, 
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Share2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { ApiResponse } from "@/types/ApiResponse";
import type { User } from "@/models/User";
import { useShare } from "@/hooks/useShare";
import ShareModal from "@/components/ShareModal";

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const { share, isModalOpen, setIsModalOpen, shareData } = useShare();

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setAcceptMessages(response.data.isAcceptingMessages as boolean);
    } catch (error) {
      console.error("Failed to fetch message settings", error);
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchAcceptMessages();
    }
  }, [session, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setAcceptMessages(!acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Failed to update message settings."
      );
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestionContent.trim()) {
      return toast.error("Question content cannot be empty");
    }

    setIsCreatingThread(true);
    try {
      const response = await axios.post<ApiResponse>("/api/create-question", {
        content: newQuestionContent,
      });
      if (response.data.success) {
        toast.success("Thread created successfully!");
        setNewQuestionContent("");
        // Redirect to the manage page of the new thread
        const questionId = response.data.question?._id;
        if (questionId) {
          router.push(`/dashboard/question/${questionId}`);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to create thread."
      );
    } finally {
      setIsCreatingThread(false);
    }
  };

  if (!session?.user) return null;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const handleShareProfile = () => {
    share({
      title: "Send me anonymous messages 👀",
      text: "Send me anonymous messages 👀",
      url: profileUrl,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied!");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-0 animate-[slideUp_0.8s_0.1s_ease_both]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
            <LayoutDashboard className="h-10 w-10 text-violet-400" />
            My <span className="shimmer-text">Dashboard</span>
          </h1>
        </div>
        
        <div className="badge-pill px-5 py-3 rounded-2xl flex items-center gap-4 border-white/10 shadow-xl">
          <div className={cn(
            "h-3 w-3 rounded-full relative",
            acceptMessages ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-slate-500"
          )}>
            {acceptMessages && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
              {acceptMessages ? "Accepting Messages" : "Inbox Paused"}
            </span>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Link Section */}
        <div className="glass-card p-8 rounded-[2rem] flex flex-col opacity-0 animate-[slideUp_0.8s_0.2s_ease_both]">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 flex items-center justify-center text-2xl mb-6 shadow-lg shadow-violet-900/20">
              <Zap className="h-7 w-7 text-violet-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
              Share Your Profile
            </h2>
            <p className="text-slate-400 leading-relaxed font-light">
              Anyone with this link can send you an anonymous message directly to your general inbox.
            </p>
          </div>
          
          <div className="mt-auto space-y-4">
             <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 pl-4 overflow-hidden group hover:border-violet-500/40 transition-colors">
                <code className="text-xs text-violet-300 truncate flex-1 font-mono">{profileUrl}</code>
                <Button 
                  onClick={copyToClipboard} 
                  size="icon" 
                  variant="secondary" 
                  className="h-10 w-10 rounded-xl bg-white/10 hover:bg-violet-500/20 text-violet-400 border-none shrink-0"
                >
                   <Copy className="h-4.5 w-4.5" />
                </Button>
             </div>
             <Button 
              onClick={handleShareProfile} 
              className="cta-btn w-full h-14 rounded-2xl text-white font-bold text-lg tracking-wide shadow-2xl gap-2 border-none"
             >
                <Share2 className="h-5 w-5" />
                Share Profile Link
             </Button>
          </div>
        </div>

        {/* New Question Section */}
        <div className="glass-card p-8 rounded-[2rem] flex flex-col opacity-0 animate-[slideUp_0.8s_0.3s_ease_both] relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="mb-8 relative z-10">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-500/10 border border-sky-500/30 flex items-center justify-center text-2xl mb-6 shadow-lg shadow-sky-900/20">
              <PlusCircle className="h-7 w-7 text-sky-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
              Start a New Thread
            </h2>
            <p className="text-slate-400 leading-relaxed font-light">
              Create a dedicated thread for a specific topic to get focused, anonymous feedback.
            </p>
          </div>
          
          <div className="mt-auto space-y-5 relative z-10">
            <textarea
              placeholder="e.g., What's my best quality?"
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none resize-none min-h-[120px] transition-all text-base"
            />
            <Button 
              onClick={handleCreateQuestion} 
              className="cta-btn w-full h-14 rounded-2xl text-white font-bold text-lg tracking-wide shadow-2xl border-none"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)" }}
              disabled={isCreatingThread}
            >
              {isCreatingThread ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                "Create Thread Link →"
              )}
            </Button>
          </div>
        </div>
      </div>

      {shareData && (
        <ShareModal
          isOpen={isModalOpen}
          onClose={setIsModalOpen}
          title={shareData.title}
          text={shareData.text}
          url={shareData.url}
        />
      )}
    </div>
  );
}

// Utility to merge classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
