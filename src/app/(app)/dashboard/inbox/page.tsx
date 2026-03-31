"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, RefreshCcw, Inbox as InboxIcon, ShieldCheck } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import type { ApiResponse } from "@/types/ApiResponse";
import type { Message } from "@/models/User";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) toast.success("Messages refreshed!");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Failed to fetch messages.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((m) => m._id !== messageId));
  };

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessages();
    }
  }, [session, fetchMessages, fetchAcceptMessages]);

  if (!session?.user) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-0 animate-[slideUp_0.8s_0.1s_ease_both]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
            <InboxIcon className="h-10 w-10 text-violet-400" />
            General <span className="shimmer-text">Inbox</span>
          </h1>
          <p className="text-slate-400 mt-2 font-light max-w-md">
            Anonymous messages received through your main profile link.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="badge-pill px-5 py-2.5 rounded-2xl flex items-center gap-4 border-white/10 shadow-xl">
            <div className={cn(
              "h-3 w-3 rounded-full relative",
              acceptMessages ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-slate-500"
            )}>
              {acceptMessages && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                {acceptMessages ? "Accepting" : "Paused"}
              </span>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-violet-600 scale-90"
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className="gap-2 h-12 px-6 rounded-2xl bg-white/5 border-white/10 text-slate-200 hover:bg-violet-500/10 hover:border-violet-500/40 hover:text-white transition-all shadow-xl"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-10 opacity-50" />

      {isLoading && messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-0 animate-[fadeInScale_0.6s_ease_both]">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-violet-500 relative z-10" />
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Retrieving your messages...</p>
        </div>
      ) : messages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass-card rounded-[2.5rem] border-white/5 opacity-0 animate-[fadeInScale_0.7s_0.2s_ease_both]">
          <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <InboxIcon className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Your inbox is empty</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto font-light leading-relaxed">
            Share your profile link to start receiving anonymous messages from around the world!
          </p>
        </div>
      )}
    </div>
  );
}
