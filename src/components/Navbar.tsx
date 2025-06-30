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
      <nav className="w-full bg-black text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <p className="text-2xl font-semibold text-orange-500 hover:opacity-80 transition">
            Anonymous Message
          </p>

          {/* Right Side */}
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                variant="ghost"
                className="text-white border border-gray-700 hover:bg-gray-800"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                variant="default"
                className="bg-orange-500 text-white hover:bg-orange-600"
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
