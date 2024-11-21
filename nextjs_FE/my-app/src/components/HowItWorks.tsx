"use client";
import React from "react";
import { Briefcase, FileText, Award, LineChart } from "lucide-react";
import { Cover } from "@/components/ui/cover";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const features = [
    {
      title: "Smart Job Search",
      description:
        "Leverage AI to find jobs tailored to your profile, preferences, and career aspirations, saving you countless hours.",
      icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "Cover Letter Generator",
      description:
        "Generate personalized, role-specific cover letters in seconds, aligned with your resume and the job description.",
      icon: <FileText className="w-8 h-8 text-purple-500" />,
    },
    {
      title: "Resume Scoring",
      description:
        "Receive a detailed score and actionable insights to optimize your resume for applicant tracking systems (ATS).",
      icon: <Award className="w-8 h-8 text-pink-500" />,
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor applications, analyze your success rate, and get data-driven recommendations to enhance your strategy.",
      icon: <LineChart className="w-8 h-8 text-blue-500" />,
    },
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <section className="py-12 bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              How It <Cover>Works</Cover>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI-powered tools to streamline your job search journey
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 "
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                className="max-w-md mx-auto bg-white dark:bg-black dark:hover:shadow-lg dark:hover:shadow-purple-500/[0.1] dark:border-white/[0.1] border-black/[0.1] border rounded-lg p-6 transition-shadow duration-300 ease-in-out"
              >
                <div className="flex items-center mb-4">
                  <div className="rounded-full p-2 bg-gray-50 dark:bg-neutral-900">
                    {feature.icon}
                  </div>
                  <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <button className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                  Learn more
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
