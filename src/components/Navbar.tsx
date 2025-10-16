"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <>
      <nav className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-4 shadow-lg border-b border-orange-500/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <p className="text-2xl font-bold text-primary tracking-wide cursor-pointer hover:text-orange-400 transition-all duration-300 transform hover:scale-105">
            Anonymous Message
          </p>

          {/* Right Side */}
          {session ? (
            <div className="flex items-center space-x-5">
              <span className="text-sm text-gray-300 italic">
                Welcome,&nbsp;
                <span className="font-medium text-orange-400">
                  {user?.username || user?.email}
                </span>
              </span>
              <Button
                variant="ghost"
                className="text-white border border-gray-700 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-500 transition-all duration-300 rounded-xl shadow-md hover:shadow-orange-500/30"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                variant="default"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium px-5 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-orange-500/40"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
