"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import type { ApiResponse } from "@/types/ApiResponse";
import type { Message } from "@/models/User";
import type { User } from "@/models/User";

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((m) => m._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ?? "Failed to fetch message settings."
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) toast("Messages refreshed!");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? "Failed to fetch messages.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ??
          "Failed to update message settings."
      );
    }
  };

  if (!session?.user) return <div />;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Profile link copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-5 px-3">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
          Dashboard
        </h1>

        {/* Profile Link Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Your Unique Profile Link
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full sm:flex-1 border border-gray-300 rounded-lg p-2 text-gray-600"
            />
            <Button onClick={copyToClipboard} className="w-full sm:w-auto">
              Copy Link
            </Button>
          </div>
        </div>

        {/* Accept Messages Switch */}
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="text-gray-700 font-medium">
              Accept Messages:{" "}
              <span
                className={
                  acceptMessages
                    ? "text-green-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {acceptMessages ? "On" : "Off"}
              </span>
            </span>
          </div>
        </div>

        <Separator />

        {/* Refresh Button */}
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        {/* Messages Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id as string}
                className="w-full max-w-sm transition-transform duration-200 hover:scale-[1.02]"
              >
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10 col-span-full">
              No messages to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
