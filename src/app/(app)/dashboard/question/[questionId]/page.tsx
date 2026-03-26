"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { 
  Loader2, 
  Copy, 
  Trash2, 
  MessageSquare, 
  ExternalLink,
  Calendar,
  User,
  ArrowLeft,
  ShieldCheck,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import MessageCard from "@/components/MessageCard";
import type { ApiResponse } from "@/types/ApiResponse";
import type { Message, Question } from "@/models/User";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useShare } from "@/hooks/useShare";
import ShareModal from "@/components/ShareModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function QuestionDetailPage() {
  const { questionId } = useParams() as { questionId: string };
  const { data: session } = useSession();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { share, isModalOpen, setIsModalOpen, shareData } = useShare();

  const fetchQuestionDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-question-info/${questionId}`);
      if (response.data.success) {
        setQuestion(response.data.question as Question);
      }
    } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>;
       toast.error(axiosError.response?.data.message ?? "Failed to fetch question details.");
       router.push("/dashboard/inbox");
    } finally {
      setIsLoading(false);
    }
  }, [questionId, router]);

  useEffect(() => {
    if (session?.user && questionId) {
      fetchQuestionDetails();
    }
  }, [session, questionId, fetchQuestionDetails]);

  const handleDeleteQuestion = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/delete-question/${questionId}`);
      if (response.data.success) {
        toast.success("Question deleted successfully");
        router.push("/dashboard");
        // Trigger a refresh of the sidebar somehow or just navigate
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Failed to delete question.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAcceptMessages = async (checked: boolean) => {
    try {
      setIsToggling(true);
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: checked,
        threadId: questionId,
      });
      if (response.data.success) {
        if (question) {
          setQuestion({ ...question, isAcceptingMessages: checked } as Question);
        }
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling message acceptance:", error);
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (question) {
      setQuestion({
        ...question,
        messages: (question.messages || []).filter((m) => m._id !== messageId),
      } as Question);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!question) return null;

  const publicUrl = `${window.location.protocol}//${window.location.host}/u/${(question as any).username}/${question._id}`;

  const handleShareQuestion = () => {
    share({
      title: "Send me anonymous messages 👀",
      text: `Join the conversation on this thread: "${question.content}"\nI’ll reply honestly`,
      url: publicUrl,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 text-slate-500"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {question.content}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {(question.messages || []).length} responses
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleShareQuestion} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Link
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this question and all of its responses.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteQuestion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className={cn(
        "flex items-center justify-between p-4 rounded-xl border mb-8",
        question.isAcceptingMessages 
          ? "bg-green-50 border-green-100 text-green-700" 
          : "bg-slate-50 border-slate-200 text-slate-500"
      )}>
        <div className="flex items-center gap-3">
          <ShieldCheck className={cn("h-5 w-5", question.isAcceptingMessages ? "text-green-600" : "text-slate-400")} />
          <div>
            <p className="text-sm font-bold uppercase tracking-wider">
              {question.isAcceptingMessages ? "Accepting Messages" : "Paused"}
            </p>
            <p className="text-xs opacity-80">
              {question.isAcceptingMessages 
                ? "Anyone with the link can send you anonymous responses." 
                : "No new responses can be sent to this thread."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={question.isAcceptingMessages} 
            onCheckedChange={handleToggleAcceptMessages}
            disabled={isToggling}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-blue-600 uppercase">Public Link</span>
          <code className="text-sm text-blue-800 break-all">{publicUrl}</code>
        </div>
        <Button variant="ghost" size="icon" onClick={() => window.open(publicUrl, '_blank')} className="text-blue-600">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Responses</h2>
        <Separator />
        
        {question.messages && question.messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {question.messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
                questionId={question._id as string}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900">No responses yet</p>
            <p className="text-slate-500 mt-1">Share the link above to start receiving answers!</p>
          </div>
        )}
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
