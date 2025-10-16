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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  //implementing zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Sign in failed, Incorrect username or password");
      }
      if (result?.url) {
        router.replace("/dashboard");
        toast.success("Signed in successfully");
      }
    } catch (error) {
      console.error("Error in signin of user", error);

      toast.error("Signin failed");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen items-center justify-center p-4 bg-black">
        <div className="w-full max-w-md mx-4 bg-[#0d0d0d] rounded-2xl shadow-lg p-8 space-y-6">
          {/* Title and description */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Anonymous Message</h1>
            <p className="mt-2 text-gray-400">Sign in</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email/Username</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Email/Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          {/* Sign up link */}
          <div className="text-center mt-6 text-sm text-gray-400">
            <p>
              Not a member?{" "}
              <Link
                href="/sign-up"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
