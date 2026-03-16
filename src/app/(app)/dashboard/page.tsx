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
import type { Message, Question } from "@/models/User";
import type { User } from "@/models/User";
import QuestionCard from "@/components/QuestionCard";

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

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

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/get-questions");
      setQuestions(response.data.questions || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? "Failed to fetch questions.");
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
    fetchQuestions();
  }, [session, fetchAcceptMessages, fetchMessages, fetchQuestions]);

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

  const handleCreateQuestion = async () => {
    if (!newQuestionContent.trim()) {
      return toast.error("Question content cannot be empty");
    }

    setIsCreatingQuestion(true);
    try {
      const response = await axios.post<ApiResponse>("/api/create-question", {
        content: newQuestionContent,
      });
      if (response.data.success) {
        toast.success("Question created successfully!");
        setNewQuestionContent("");
        fetchQuestions();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ?? "Failed to create question."
      );
    } finally {
      setIsCreatingQuestion(false);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700">
            Dashboard
          </h1>
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="text-gray-700 font-medium hidden sm:inline">
              Accepting Messages
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Link Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Your Public Profile Link
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Share this link to receive general anonymous messages.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full sm:flex-1 border border-gray-300 rounded-lg p-2 text-gray-600 bg-gray-50"
              />
              <Button onClick={copyToClipboard} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Copy Link
              </Button>
            </div>
          </div>

          {/* New Question Section */}
          <div className="bg-blue-50/10 p-6 rounded-xl border-blue-100 shadow-sm flex flex-col justify-between border-2 border-dashed">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-800">
                Ask a Specific Question
              </h2>
              <p className="text-sm text-blue-600/70 mb-4">
                Create a dedicated link for a specific question you want to ask.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="e.g., What should I improve in my portfolio?"
                value={newQuestionContent}
                onChange={(e) => setNewQuestionContent(e.target.value)}
                className="w-full border border-blue-200 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Button 
                onClick={handleCreateQuestion} 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                disabled={isCreatingQuestion}
              >
                {isCreatingQuestion ? <Loader2 className="animate-spin h-4 w-4" /> : "Publish Question Link"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-12">
          {/* Questions Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
                Your Specific Questions
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchQuestions()}
                className="text-gray-500 hover:text-orange-600"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.length > 0 ? (
                questions.map((question) => (
                  <QuestionCard
                    key={question._id as string}
                    question={question}
                    username={username}
                    onDelete={fetchQuestions}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 py-12 col-span-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-lg">No specific questions yet.</p>
                  <p className="text-sm mt-1">Create one above to get targeted feedback!</p>
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* General Messages Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3">
                General Inbox
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh Inbox</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message._id as string}
                    className="w-full transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <MessageCard
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-12 col-span-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-lg">Your inbox is empty.</p>
                  <p className="text-sm mt-1">Share your profile link to get some messages!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
