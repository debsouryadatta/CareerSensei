"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SidebarComponent from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const GenerateCoverLetter = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateCoverLetter = async () => {
    // Validate inputs
    if (!jobDescription.trim() && !jobDescriptionFile) {
      setError("Please provide a job description or upload a job description file.");
      return;
    }

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("resume_type", resumeFile.type.includes("pdf") ? "pdf" : "image");

    if (jobDescription.trim()) {
      formData.append("job_description", jobDescription);
    } else if (jobDescriptionFile) {
      formData.append("job_description_file", jobDescriptionFile);
      formData.append(
        "job_description_type",
        jobDescriptionFile.type.includes("pdf") ? "pdf" : "image"
      );
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/cover_letter/create", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Failed to generate cover letter.");
      }

      setCoverLetter(result.data.cover_letter);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
       <div className="flex flex-col lg:flex-row h-screen">
      <SidebarComponent />
      <div className="flex-1 p-4 lg:p-8 bg-gray-100 dark:bg-neutral-800">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-4 lg:p-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">
                  Generate Your Cover Letter
                </h1>

                {/* Tabs Section */}
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid grid-cols-2 gap-2 lg:gap-0 mb-6">
                    <TabsTrigger value="text" className="text-sm lg:text-base">
                      Job Description Text
                    </TabsTrigger>
                    <TabsTrigger value="file" className="text-sm lg:text-base">
                      Job Description File
                    </TabsTrigger>
                  </TabsList>

                  {/* Job Description Text Input */}
                  <TabsContent value="text">
                    <div className="mb-6">
                      <Input
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>

                  {/* Job Description File Upload */}
                  <TabsContent value="file">
                    <div className="mb-6">
                      <div
                        className="border-2 border-dashed rounded-lg p-6 text-center hover:border-indigo-500"
                      >
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, setJobDescriptionFile)}
                          className="hidden"
                          id="job-desc-upload"
                          accept=".pdf,.doc,.docx"
                        />
                        <label
                          htmlFor="job-desc-upload"
                          className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                        >
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <span>Upload Job Description File</span>
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
                          {jobDescriptionFile ? `Selected: ${jobDescriptionFile.name}` : "Drag and drop or click to browse."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Resume Upload Section */}
                <div className="mb-6">
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-indigo-500"
                  >
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, setResumeFile)}
                      className="hidden"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <span>Upload Resume</span>
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      {resumeFile ? `Selected: ${resumeFile.name}` : "Drag and drop or click to browse."}
                    </p>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateCoverLetter}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Cover Letter"}
                </Button>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Generated Cover Letter */}
                {coverLetter && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-6 bg-white rounded-lg shadow-md border"
                  >
                    <div className="mt-8 space-y-6">
                    <h3 className="font-semibold mb-4">Generated Cover Letter:</h3>
                    <pre className="whitespace-pre-wrap text-gray-700">{coverLetter}</pre>
                    </div>
                  </motion.div>
                )}
            
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateCoverLetter;
