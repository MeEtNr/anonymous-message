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
    <Card className="relative">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="absolute top-4 right-4 h-10 w-10 p-2"
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-6 h-6" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={handleDeleteConfirm}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardHeader className="pr-16">
        {" "}
        {/* <--- Add padding-right here */}
        <CardTitle className="text-xl break-words overflow-hidden text-ellipsis">
          {message.content}
        </CardTitle>
        <CardDescription>
          {new Date(message.createdAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
