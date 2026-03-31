"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2, ShieldCheck } from "lucide-react";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verification", error);
      toast.error("Verification failed. Check your code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes floatOrb {
          0%   { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%  { transform: scale(0.95); opacity: 1; }
          100%{ transform: scale(1.3); opacity: 0; }
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
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .cta-btn {
          background: linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);
          background-size: 200% auto;
          transition: all 0.4s ease;
          position: relative; overflow: hidden;
          width: 100%;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 1rem;
          color: white;
          letter-spacing: 0.025em;
          border: none; cursor: pointer;
        }
        .cta-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);
          opacity:0; transition:opacity 0.3s ease;
        }
        .cta-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(14,165,233,0.2);
          transform: translateY(-2px) scale(1.01);
        }
        .cta-btn:hover:not(:disabled)::after { opacity:1; }
        .cta-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .badge-pill {
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.35);
          backdrop-filter: blur(10px);
        }
        .auth-input {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(139,92,246,0.2) !important;
          color: white !important;
          border-radius: 0.75rem !important;
          font-size: 1.5rem !important;
          letter-spacing: 0.4em !important;
          text-align: center !important;
          transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
        .auth-input::placeholder { color: #475569 !important; letter-spacing: 0.2em !important; font-size: 1rem !important; }
        .auth-input:focus {
          border-color: rgba(139,92,246,0.6) !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12) !important;
          outline: none !important;
        }
        .auth-label { color: #94a3b8; font-size: 0.875rem; font-weight: 500; }
        .card-anim { animation: slideUp 0.7s 0.1s ease both; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),
            linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px);
          background-size: 60px 60px;
        }
        .icon-pulse::before {
          content:'';
          position:absolute; inset:-6px;
          border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.5);
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse at 0% 80%, rgba(14,165,233,0.08) 0%, transparent 50%), #080810",
        }}
      >
        {/* Grid background */}
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

        {/* Floating orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-3xl opacity-20" style={{ width:450, height:450, background:"radial-gradient(circle,#7c3aed,#4f46e5)", top:"-10%", left:"55%", animation:"floatOrb 8s 0s ease-in-out infinite alternate" }} />
          <div className="absolute rounded-full blur-3xl opacity-15" style={{ width:350, height:350, background:"radial-gradient(circle,#10b981,#0ea5e9)", top:"65%", left:"-5%", animation:"floatOrb 10s 3s ease-in-out infinite alternate" }} />
        </div>

        {/* Card */}
        <div className="card-anim relative z-10 w-full max-w-md">
          <div
            className="glass-card rounded-3xl p-8 sm:p-10 space-y-8"
            style={{ boxShadow:"0 0 60px rgba(124,58,237,0.12), 0 0 0 1px rgba(139,92,246,0.08)" }}
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative icon-pulse">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(14,165,233,0.2))",
                    border: "1px solid rgba(139,92,246,0.4)",
                    boxShadow: "0 0 30px rgba(124,58,237,0.2)",
                  }}
                >
                  <ShieldCheck className="w-8 h-8 text-violet-300" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="text-white">Verify your </span>
                <span className="shimmer-text">account</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-light">
                We sent a 6-digit code to your email. Enter it below to activate your account.
              </p>
            </div>

            {/* User context */}
            {params.username && (
              <div className="flex justify-center">
                <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-violet-300">
                  <span className="text-slate-500">Verifying</span>
                  <span className="text-violet-400 font-semibold">@{params.username}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="auth-label text-center block">Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="· · · · · ·"
                          maxLength={6}
                          className="auth-input py-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs text-center" />
                    </FormItem>
                  )}
                />

                <button type="submit" disabled={isSubmitting} className="cta-btn">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    "Verify & activate →"
                  )}
                </button>
              </form>
            </Form>

            {/* Help text */}
            <p className="text-center text-xs text-slate-600 leading-relaxed">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                resend code
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyAccount;
