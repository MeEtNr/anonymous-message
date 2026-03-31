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
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* ── TOP NAV & HEADER ── */}
      <div className="opacity-0 animate-[slideUp_0.8s_0.1s_ease_both]">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 h-10 px-4 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all group"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
              {question.content}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <Calendar className="h-4 w-4 text-violet-400" />
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <MessageSquare className="h-4 w-4 text-sky-400" />
                {(question.messages || []).length} responses
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleShareQuestion} 
              variant="outline" 
              className="gap-2 h-12 px-6 rounded-2xl bg-white/5 border-white/10 text-slate-200 hover:bg-violet-500/10 hover:border-violet-500/40 hover:text-white transition-all shadow-xl"
            >
              <Share2 className="h-4 w-4" />
              Share Thread
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  disabled={isDeleting}
                  className="h-12 w-12 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 transition-all shadow-xl"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-card border-white/10 bg-slate-950/90 backdrop-blur-xl rounded-[2rem]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white font-bold">Delete Thread</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    This will permanently delete this question and all of its responses.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteQuestion} className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div className={cn(
        "flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 opacity-0 animate-[slideUp_0.8s_0.2s_ease_both] shadow-2xl",
        question.isAcceptingMessages 
          ? "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-950/20" 
          : "bg-white/5 border-white/10"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl",
            question.isAcceptingMessages ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"
          )}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
              {question.isAcceptingMessages ? "Accepting Responses" : "Thread Paused"}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-light">
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
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>

      {/* ── PUBLIC LINK BANNER ── */}
      <div className="glass-card rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-0 animate-[slideUp_0.8s_0.3s_ease_both]">
        <div className="flex flex-col gap-1.5 overflow-hidden w-full">
          <span className="text-xs font-black text-violet-400 uppercase tracking-widest">Public Sharing Link</span>
          <code className="text-sm text-violet-200/70 font-mono break-all bg-white/5 px-4 py-2 rounded-xl border border-white/5">{publicUrl}</code>
        </div>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={() => window.open(publicUrl, '_blank')} 
          className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-violet-500/20 text-violet-400 border border-white/5 shrink-0 transition-all"
        >
          <ExternalLink className="h-5 w-5" />
        </Button>
      </div>

      {/* ── RESPONSES SECTION ── */}
      <div className="space-y-8 opacity-0 animate-[fadeInScale_1s_0.4s_ease_both]">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-white tracking-tight">Responses</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
        </div>
        
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
          <div className="text-center py-24 glass-card rounded-[2.5rem] border-white/5 border-dashed">
            <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 border-dashed rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No responses yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto font-light leading-relaxed">
              Share the thread link above to start collecting unfiltered anonymous feedback!
            </p>
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
