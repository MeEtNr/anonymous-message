"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) toast.error("Incorrect username or password");
      if (result?.url) {
        router.replace("/dashboard");
        toast.success("Signed in successfully");
      }
    } catch (error) {
      console.error("Error in signin of user", error);
      toast.error("Sign in failed");
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
          transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
        .auth-input::placeholder { color: #64748b !important; }
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
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.1) 0%, transparent 50%), #080810",
        }}
      >
        {/* Grid background */}
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

        {/* Floating orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute rounded-full blur-3xl opacity-20" style={{ width:500, height:500, background:"radial-gradient(circle,#7c3aed,#4f46e5)", top:"-15%", left:"-10%", animation:"floatOrb 8s 0s ease-in-out infinite alternate" }} />
          <div className="absolute rounded-full blur-3xl opacity-15" style={{ width:400, height:400, background:"radial-gradient(circle,#0ea5e9,#06b6d4)", top:"50%", left:"75%", animation:"floatOrb 10s 2s ease-in-out infinite alternate" }} />
        </div>

        {/* Card */}
        <div className="card-anim relative z-10 w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 sm:p-10 space-y-7"
            style={{ boxShadow:"0 0 60px rgba(124,58,237,0.12), 0 0 0 1px rgba(139,92,246,0.08)" }}>

            {/* Badge */}
            <div className="flex justify-center">
              <div className="badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-violet-300 tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                </span>
                Welcome back
              </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="text-white">Sign in to </span>
                <span className="shimmer-text">AnnoMessage</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-light">
                Access your anonymous feedback dashboard
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="auth-label">Email / Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="you@example.com"
                          className="auth-input"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="auth-label">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="auth-input"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />

                <div className="pt-1">
                  <button type="submit" disabled={isSubmitting} className="cta-btn">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in…
                      </span>
                    ) : (
                      "Sign in →"
                    )}
                  </button>
                </div>
              </form>
            </Form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px]" style={{ background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent)" }} />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-[1px]" style={{ background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent)" }} />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-slate-500">
              No account yet?{" "}
              <Link href="/sign-up" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
