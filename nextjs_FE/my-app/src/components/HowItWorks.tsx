"use client";
import React from "react";
// import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Brain, Target, Filter, LineChart } from "lucide-react";
import { Cover } from "@/components/ui/cover"

export default function HowItWorks() {
  const features = [
    {
      title: "Smart Resume Analysis",
      description: "Our AI analyzes your resume to understand your skills, experience, and career goals for perfect job matches.",
      icon: <Brain className="w-8 h-8 text-indigo-500" />,
      // image: "/api/placeholder/800/400"
    },
    {
      title: "Intelligent Job Matching",
      description: "Advanced algorithms match your profile with relevant opportunities using contextual understanding and machine learning.",
      icon: <Target className="w-8 h-8 text-purple-500" />,
      // image: "/api/placeholder/800/400"
    },
    {
      title: "Smart Filtering",
      description: "AI-powered filters adapt to your preferences and suggest relevant criteria based on your profile.",
      icon: <Filter className="w-8 h-8 text-pink-500" />,
      // image: "/api/placeholder/800/400"
    },
    {
      title: "Progress Tracking",
      description: "Track applications, get insights, and receive personalized recommendations to improve your job search.",
      icon: <LineChart className="w-8 h-8 text-blue-500" />,
      // image: "/api/placeholder/800/400"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800
">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            How It <Cover>Works</Cover>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Powered by AI to streamline your job search journey
          </p>
        </div>

      
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">

  {features.map((feature, index) => (
    <CardContainer key={index} className="inter-var">
      <CardBody className="relative group/card bg-white dark:bg-black dark:hover:shadow-lg dark:hover:shadow-purple-500/[0.1] dark:border-white/[0.1] border-black/[0.1] w-full h-auto rounded-lg p-4 border">
        <div className="flex items-center mb-4">
          <CardItem translateZ="50" className="rounded-full p-2 bg-gray-50 dark:bg-neutral-900">
            {feature.icon}
          </CardItem>
          <CardItem translateZ="50" className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
            {feature.title}
          </CardItem>
        </div>
        <CardItem as="p" translateZ="60" className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {feature.description}
        </CardItem>
        <CardItem translateZ="50" className="mt-4">
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
            Learn more
          </button>
        </CardItem>
      </CardBody>
    </CardContainer>
  ))}
</div>
</div>

    </section>
  );
}