"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, Send, MessageCircle } from "lucide-react";
import { useShare } from "@/hooks/useShare";
import ShareModal from "@/components/ShareModal";

interface QuestionData {
  _id: string;
  content: string;
  username: string;
  createdAt: string;
  isAcceptingMessages: boolean;
}

// Floating orb component (from design-system)
function FloatingOrb({
  size,
  color,
  top,
  left,
  delay,
  duration,
}: {
  size: number;
  color: string;
  top: string;
  left: string;
  delay: string;
  duration: string;
}) {
  return (
    <div
      className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
        animation: `floatOrb ${duration} ${delay} ease-in-out infinite alternate`,
      }}
    />
  );
}

const QuestionPage = () => {
  const params = useParams<{ username: string; questionId: string }>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const { share, isModalOpen, setIsModalOpen, shareData } = useShare();

  const username = params.username;
  const questionId = params.questionId;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/get-question-info/${questionId}`);
        if (response.data.success) {
          setQuestion(response.data.question);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        toast.error("Failed to load question");
      } finally {
        setFetching(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleSubmit = async () => {
    if (!message.trim()) return toast.error("Message cannot be empty");

    try {
      setLoading(true);

      const { status } = await axios.post("/api/send-question-message", {
        questionId,
        content: message,
      });

      if (status === 201) {
        toast.success("Message sent successfully");
        setMessage(""); // clear input
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Unable to send a message";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-12 w-3/4 bg-white/5 rounded-2xl" />
          <Skeleton className="h-48 w-full bg-white/5 rounded-[2.5rem]" />
          <Skeleton className="h-16 w-1/3 mx-auto bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center p-6 text-center">
        <div className="glass-card p-10 rounded-[2.5rem] max-w-lg">
          <h1 className="text-3xl font-black text-rose-500 mb-4 uppercase">Thread Not Found</h1>
          <p className="text-slate-400">The thread you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes floatOrb {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shimmer-text {
          background: linear-gradient(90deg,#a78bfa 0%,#818cf8 25%,#38bdf8 50%,#818cf8 75%,#a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(139,92,246,0.4);
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(139,92,246,0.15), 0 0 0 1px rgba(139,92,246,0.1);
        }
        .message-card {
          background: rgba(15,15,30,0.8);
          border: 1px solid rgba(139,92,246,0.2);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }
        .message-card:hover {
          border-color: rgba(139,92,246,0.5);
          box-shadow: 0 0 30px rgba(139,92,246,0.1);
          transform: translateY(-4px);
        }
        .cta-btn {
          background: linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);
          background-size: 200% auto;
          transition: all 0.4s ease;
          position: relative; overflow: hidden;
        }
        .cta-btn:hover {
          background-position: right center;
          box-shadow: 0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(14,165,233,0.2);
          transform: translateY(-2px) scale(1.02);
        }
        .grid-bg {
          background-image: linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);
          background-size: 60px 60px;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
        .badge-pill {
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.35);
          backdrop-filter: blur(10px);
        }
      `}</style>

      <main
        className="min-h-screen py-12 px-4 md:px-6 relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 0%, rgba(14,165,233,0.1) 0%, transparent 50%), #080810",
        }}
      >
        {/* Background Layers */}
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
        <div className="fixed inset-0 noise-overlay pointer-events-none z-0" />
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <FloatingOrb size={400} color="radial-gradient(circle,#7c3aed,#4f46e5)" top="-10%" left="-5%" delay="0s" duration="8s" />
          <FloatingOrb size={300} color="radial-gradient(circle,#0ea5e9,#06b6d4)" top="20%" left="80%" delay="2s" duration="10s" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-8 animate-[slideUp_0.8s_ease_both]">
          {/* Header Action */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="badge-pill gap-2 rounded-full text-violet-300 hover:text-white border-violet-500/20"
              onClick={() => share({
                title: "Send me anonymous messages 👀",
                text: `Join the conversation on this thread: "${question.content}"\nI’ll reply honestly`,
                url: window.location.href,
              })}
            >
              <Share2 className="h-4 w-4" />
              Share Thread
            </Button>
          </div>

          {/* Main Title - Center aligned to match profile page */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-tight">
              Thread for <br />
              <span className="shimmer-text">@{username}</span>
            </h1>
            <p className="text-slate-400 font-light text-base md:text-lg max-w-xl mx-auto">
              Participate in this dedicated conversation anonymously.
            </p>
          </div>

          {/* Question Card - Styled to feel like a premium focus card */}
          <div className="message-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-violet-500/30">
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-600/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 flex items-center justify-center text-2xl shadow-lg shadow-violet-900/20">
                <MessageCircle className="h-7 w-7 text-violet-400" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                "{question.content}"
              </h2>
            </div>
          </div>

          {/* Input Section */}
          <div className="glass-card p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-widest text-violet-400 uppercase ml-1">
                  Reply Anonymously
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={question.isAcceptingMessages ? "Share your honest thoughts..." : "This thread is currently not accepting messages"}
                  className="w-full bg-white/5 border-white/10 rounded-2xl p-4 md:p-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 outline-none resize-none min-h-[160px] transition-all text-base md:text-lg leading-relaxed shadow-inner"
                  disabled={!question.isAcceptingMessages}
                />
                {!question.isAcceptingMessages && (
                  <p className="text-rose-500 text-xs md:text-sm mt-2 font-bold px-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    This thread has been paused by the creator.
                  </p>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !question.isAcceptingMessages}
                  className="cta-btn h-14 md:h-16 px-10 md:px-14 rounded-2xl text-white font-black text-lg md:text-xl tracking-wide shadow-2xl gap-3 border-none disabled:opacity-30"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Anonymously
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-8 text-center">
             <p className="text-slate-400 font-light text-sm md:text-base max-w-md mx-auto">
              Your response is completely anonymous. 
              @{username} will receive it in their private dashboard.
            </p>
            <div className="mt-8 border-t border-white/5 pt-8">
               <p className="text-slate-500 text-xs md:text-sm font-medium tracking-wide">
                🔒 Protected by <span className="text-violet-400/80 font-bold uppercase tracking-tight">AnnoMessage</span> End-to-End Anonymity
              </p>
            </div>
          </div>
        </div>
      </main>

      {shareData && (
        <ShareModal
          isOpen={isModalOpen}
          onClose={setIsModalOpen}
          title={shareData.title}
          text={shareData.text}
          url={shareData.url}
        />
      )}
    </>
  );
};

export default QuestionPage;
