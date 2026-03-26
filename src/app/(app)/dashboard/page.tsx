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
      text: "Send me anonymous messages 👀\nI’ll reply honestly",
      url: profileUrl,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied!");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
            Dashboard
          </h1>
          {/* <p className="text-slate-500 mt-1">
            Welcome back, {username}! Manage your anonymous conversations here.
          </p> */}
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 pr-4 rounded-full shadow-sm">
          <div className={cn(
            "p-2 rounded-full",
            acceptMessages ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
          )}>
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              {acceptMessages ? "Accepting Messages" : "Direct Inbox Paused"}
            </span>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Profile Link Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Share Your Profile
            </h2>
            <p className="text-slate-500">
              Anyone with this link can send you an anonymous message directly to your general inbox.
            </p>
          </div>
          <div className="mt-auto space-y-3">
             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-hidden">
                <code className="text-xs text-slate-600 truncate flex-1">{profileUrl}</code>
                <Button onClick={copyToClipboard} size="sm" variant="ghost" className="h-8 px-2 text-blue-600">
                   <Copy className="h-4 w-4" />
                </Button>
             </div>
             <Button onClick={handleShareProfile} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
                <Share2 className="h-4 w-4" />
                Share My Profile Link
             </Button>
          </div>
        </div>

        {/* New Question Section - The ChatGPT-like CTA */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl flex flex-col text-white">
          <div className="mb-6">
             <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-4">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Start a New Thread
            </h2>
            <p className="text-slate-400">
              Create a dedicated thread for a specific topic to get focused, anonymous feedback.
            </p>
          </div>
          
          <div className="mt-auto space-y-4">
            <textarea
              placeholder="e.g., What's my best quality?"
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px]"
            />
            <Button 
              onClick={handleCreateQuestion} 
              className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-6"
              disabled={isCreatingThread}
            >
              {isCreatingThread ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Thread Link"}
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
