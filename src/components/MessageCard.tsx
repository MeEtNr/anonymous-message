"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "./ui/button";
import { X, Loader2 } from "lucide-react";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/models/User";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  questionId?: string;
};

const MessageCard = ({ message, onMessageDelete, questionId }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!message._id) {
      toast.error("Cannot delete message: Missing ID. This might be an old message.");
      return;
    }

    setIsDeleting(true);
    try {
      const url = questionId 
        ? `/api/delete-message/${message._id}?questionId=${questionId}`
        : `/api/delete-message/${message._id}`;
        
      console.log("DEBUG: Deleting message with URL:", url);
      const response = await axios.delete<ApiResponse>(url);
      if (response.data.success) {
        toast.success(response.data.message);
        onMessageDelete(message._id as string);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("DEBUG: Delete error response:", axiosError.response?.data);
      toast.error(axiosError.response?.data.message ?? "Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="message-card glass-card rounded-[2rem] p-7 group relative opacity-0 animate-[fadeInScale_0.5s_ease_both]">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="absolute top-4 right-4 h-10 w-10 p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border-none transition-all duration-300"
            variant="ghost"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="glass-card border-white/10 bg-slate-950/90 backdrop-blur-xl rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-bold">Delete Message</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete your
              message from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all"
              onClick={handleDeleteConfirm}
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="pr-12">
        <p className="text-lg font-medium text-slate-100 leading-relaxed mb-6 break-words italic">
          {message.content}
        </p>
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center text-sm font-black text-violet-400 shrink-0 shadow-lg shadow-violet-950/10 transition-all">
            ?
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-300">
               {new Date(message.createdAt).toLocaleString("en-IN", {
                 dateStyle: "medium",
                 timeStyle: "short",
               })}
            </span>
            <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-widest opacity-60">
               Received
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
