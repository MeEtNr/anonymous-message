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
    <div className="p-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <InboxIcon className="h-8 w-8 text-blue-600" />
            General Inbox
          </h1>
          <p className="text-slate-500 mt-1">
            Anonymous messages received through your main profile link.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 pr-4 rounded-full shadow-sm w-fit">
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

          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className="gap-2 h-[52px] px-6 rounded-full border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      <Separator className="mb-8" />

      {isLoading && messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-500">Loading your messages...</p>
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
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <InboxIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-900">Your inbox is empty</p>
          <p className="text-slate-500 mt-1">Share your profile link to receive anonymous messages!</p>
        </div>
      )}
    </div>
  );
}
