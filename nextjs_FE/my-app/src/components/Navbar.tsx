// // components/Navbar.tsx


"use client";
import Link from "next/link";
import { SparklesCore } from "../components/ui/sparkles"; // Adjust the import path if necessary

export const Navbar = () => {
  
  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-3 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Wrap Link with SparklesCore */}
        <div className="relative">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="absolute inset-0 z-10" // Position the SparklesCore
            particleColor="#FFFFFF"
          />
          <Link 
            href="/" 
            className="relative z-20 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            CareerSensei
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
         
          <Link href="/auth/signin">
            <button className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
              Sign In
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
