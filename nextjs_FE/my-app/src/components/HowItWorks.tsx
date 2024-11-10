"use client";
import React from "react";
// import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Brain, Target, Filter, LineChart } from "lucide-react";

export default function HowItWorks() {
  const features = [
    {
      title: "Smart Resume Analysis",
      description: "Our AI analyzes your resume to understand your skills, experience, and career goals for perfect job matches.",
      icon: <Brain className="w-8 h-8 text-indigo-500" />,
      image: "/api/placeholder/800/400"
    },
    {
      title: "Intelligent Job Matching",
      description: "Advanced algorithms match your profile with relevant opportunities using contextual understanding and machine learning.",
      icon: <Target className="w-8 h-8 text-purple-500" />,
      image: "/api/placeholder/800/400"
    },
    {
      title: "Smart Filtering",
      description: "AI-powered filters adapt to your preferences and suggest relevant criteria based on your profile.",
      icon: <Filter className="w-8 h-8 text-pink-500" />,
      image: "/api/placeholder/800/400"
    },
    {
      title: "Progress Tracking",
      description: "Track applications, get insights, and receive personalized recommendations to improve your job search.",
      icon: <LineChart className="w-8 h-8 text-blue-500" />,
      image: "/api/placeholder/800/400"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Powered by AI to streamline your job search journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <CardContainer key={index} className="inter-var">
              <CardBody className="relative group/card bg-white dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                <div className="flex items-center gap-4 mb-4">
                  <CardItem
                    translateZ="50"
                    className="rounded-full p-2 bg-gray-50 dark:bg-neutral-900"
                  >
                    {feature.icon}
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    {feature.title}
                  </CardItem>
                </div>

                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4"
                >
                  {feature.description}
                </CardItem>

                <CardItem translateZ="100" className="w-full mt-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                    />
                  </div>
                </CardItem>

                <CardItem
                  translateZ="50"
                  className="mt-4"
                >
                  <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                    Learn more
                  </button>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
{/* 
        <div className="mt-16 text-center">
          <CardContainer className="inline-block">
            <CardBody className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-px rounded-xl">
              <div className="bg-white dark:bg-black rounded-xl p-6">
                <CardItem
                  translateZ="50"
                  className="flex items-center justify-center gap-2 text-xl font-bold"
                >
                  <Bot className="w-6 h-6" />
                  <span>Ready to transform your job search?</span>
                </CardItem>
                <CardItem
                  translateZ="50"
                  className="mt-4"
                >
                  <button className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
                    Get Started Now
                  </button>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div> */}
      </div>
    </section>
  );
}