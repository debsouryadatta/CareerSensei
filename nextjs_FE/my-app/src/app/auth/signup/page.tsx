// app/auth/signin/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useRouter } from 'next/navigation';
import { useAuth0 } from "@auth0/auth0-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add your authentication logic here
      
      // After successful authentication, redirect to JobSearch page
      router.push('/jobsearch'); 
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const { loginWithRedirect } = useAuth0();
  const handleGoogleSignIn = async () => {
    await loginWithRedirect({
      authorizationParams: {
        prompt: "login",
      },
    });
  }


  return (
    <BackgroundBeams>
    <div className="w-full max-w-md  flex flex-col items-center justify-center px-4">
    <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Welcome Back
          </h2>
          
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
        
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-700 dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-700 dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">
                  Or continue with
                </span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              className="mt-4 w-full py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
          
          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
           Don&#39;t have an account?{" "}
            <Link href="/auth/signup" className="text-indigo-500 hover:text-indigo-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    </BackgroundBeams>
  );
}