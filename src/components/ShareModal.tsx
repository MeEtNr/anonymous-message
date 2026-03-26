"use client";

import React from "react";
import { 
  X, 
  Copy, 
  Check, 
  MessageCircle, 
  Send
} from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription,
  AlertDialogCancel 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  title: string;
  text: string;
  url: string;
}

const ShareModal = ({ isOpen, onClose, title, text, url }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const shareText = `${text}\n\n${url}`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const whatsappUrl = `https://wa.me/?text=${encodedShareText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(text)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px] p-6 rounded-2xl">
        <AlertDialogHeader className="flex flex-row items-center justify-between mb-2">
          <AlertDialogTitle className="text-xl font-bold text-slate-900">
            Share your link
          </AlertDialogTitle>
          <AlertDialogCancel className="border-none p-1 h-auto hover:bg-slate-100 rounded-full">
            <X className="h-5 w-5 text-slate-500" />
          </AlertDialogCancel>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-slate-500 mb-6">
          Choose how you want to share your anonymous message link.
        </AlertDialogDescription>

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => window.open(whatsappUrl, "_blank")}
            className="w-full justify-start gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white h-14 rounded-xl text-lg font-semibold"
          >
            <MessageCircle className="h-6 w-6" />
            Share on WhatsApp
          </Button>

          <Button
            onClick={() => window.open(telegramUrl, "_blank")}
            className="w-full justify-start gap-3 bg-[#0088cc] hover:bg-[#007bbd] text-white h-14 rounded-xl text-lg font-semibold"
          >
            <Send className="h-6 w-6" />
            Share on Telegram
          </Button>

          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 ml-1">Or Copy Link</p>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 pl-4">
              <code className="text-sm text-slate-600 truncate flex-1">{url}</code>
              <Button 
                onClick={copyToClipboard} 
                variant="ghost" 
                size="sm" 
                className="h-10 px-3 text-blue-600 hover:bg-blue-50"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShareModal;
