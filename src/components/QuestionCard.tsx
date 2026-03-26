import React, { useState } from "react";
import {
  Card,
  CardContent,
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
import { X, MessageSquare, Copy, Trash2 } from "lucide-react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Question } from "@/models/User";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

type QuestionCardProps = {
  question: Question;
  username: string;
  onDelete?: () => void;
};

const QuestionCard = ({ question, username, onDelete }: QuestionCardProps) => {
  const [showMessages, setShowMessages] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(question.isAcceptingMessages);
  const [isToggling, setIsToggling] = useState(false);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const questionUrl = `${baseUrl}/u/${username}/${question._id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(questionUrl);
    toast("Thread link copied!");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.post(`/api/delete-question/${question._id}`);
      if (response.data.success) {
        toast.success("Thread deleted successfully");
        if (onDelete) onDelete();
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete thread");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAcceptMessages = async (checked: boolean) => {
    try {
      setIsToggling(true);
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: checked,
        threadId: question._id,
      });
      if (response.data.success) {
        setIsAccepting(checked);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling message acceptance:", error);
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-blue-100">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex-1 pr-4">
          <CardTitle className="text-xl font-bold text-gray-800 break-words">
            {question.content}
          </CardTitle>
          <CardDescription className="mt-1">
            Created on {new Date(question.createdAt).toLocaleDateString()}
          </CardDescription>
          <div className="flex items-center space-x-2 mt-3">
            <Switch
              id={`accept-messages-${question._id}`}
              checked={isAccepting}
              onCheckedChange={handleToggleAcceptMessages}
              disabled={isToggling}
            />
            <Label 
              htmlFor={`accept-messages-${question._id}`}
              className="text-xs font-medium text-slate-500 cursor-pointer"
            >
              {isToggling ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : isAccepting ? (
                "Accepting Messages"
              ) : (
                "Paused"
              )}
            </Label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            title="Copy thread link"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                disabled={isDeleting}
                title="Delete thread"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will delete the thread and its link. You won't be able to receive more responses for this thread.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-gray-600">
            <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
            <span>{question.messages.length} Responses</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMessages(!showMessages)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showMessages ? "Hide Responses" : "View Responses"}
          </Button>
        </div>

        {showMessages && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <Separator className="my-2" />
            {question.messages.length > 0 ? (
              question.messages
                .slice()
                .reverse()
                .map((msg: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <p className="text-sm text-gray-800">{msg.content}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No responses yet for this thread.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
