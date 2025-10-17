"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <>
      <nav className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg border-b border-blue-500/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/">
            <p className="text-2xl font-bold text-white tracking-wide cursor-pointer hover:text-blue-400 transition-all duration-300 transform hover:scale-105">
              Anonymous Message
            </p>
          </Link>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-5">
            {session ? (
              <>
                <span className="text-sm text-gray-300 italic">
                  Welcome,&nbsp;
                  <span className="font-medium text-blue-400">
                    {user?.username || user?.email}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  className="text-white border border-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 transition-all duration-300 rounded-xl shadow-md hover:shadow-blue-500/30"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-5 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-500/40"
                >
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-800"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white border-l border-blue-700 px-6 py-8"
              >
                <div className="flex flex-col items-start space-y-6 mt-2 w-full">
                  {session ? (
                    <>
                      <div className="w-full">
                        <p className="text-sm text-gray-300 italic mb-4">
                          Welcome,&nbsp;
                          <span className="font-semibold text-blue-400">
                            {user?.username || user?.email}
                          </span>
                        </p>

                        <Button
                          variant="ghost"
                          className="w-full text-white border border-blue-600 bg-blue-800/40 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 transition-all duration-300 rounded-xl shadow-md hover:shadow-blue-500/30 py-2.5"
                          onClick={() => signOut()}
                        >
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Link href="/sign-in" className="w-full">
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-500/40"
                      >
                        Sign in
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
