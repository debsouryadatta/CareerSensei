"use client";

import { Navbar } from "@/components/Navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth0()

  useEffect(() => {
    if(!isLoading && isAuthenticated){
      router.replace('/dashboard');
    }
  },[isAuthenticated, isLoading, router])

  return (
    <>
      <BackgroundBeams>
        <Navbar />
        <div className="relative z-10 max-w-5xl px-5">
          <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          Guiding Your Career Journey,
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">Powered by Possibilities!</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span className="">Powered by Possibilities!</span>
              </div>
            </div>
          </h2>
        </div>
      </BackgroundBeams>
      <div className="how-it-works">
        <HowItWorks />
      </div>
      <Footer />
    </>
  );
}