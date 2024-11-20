"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SidebarComponent from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Upload, BookmarkPlus } from 'lucide-react';

const GenerateCoverLetter = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGenerateCoverLetter = async () => {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate cover letter.");
      }

      const result = await response.json();
      setCoverLetter(result.data.cover_letter);
      setSuccessMessage("Cover letter generated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoverLetter = async () => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      setError("Please log in to save your cover letter.");
      return;
    }

    if (!coverLetter) {
      setError("No cover letter to save.");
      return;
    }

    setSaveLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/v1/cover_letter/save/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Generated Cover Letter",
          content: coverLetter,
          job_description: jobDescription || "Job description from file",
          resume_text: resumeFile ? resumeFile.name : "Resume from file"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save cover letter.");
      }

      setSuccessMessage("Cover letter saved successfully!");
    } catch (error) {
      setError(`Error saving cover letter: ${error.message}`);
      console.error("Save error:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setError(""); // Clear any previous errors
    }
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

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid grid-cols-2 gap-2 lg:gap-0 mb-6">
                  <TabsTrigger value="text">Job Description Text</TabsTrigger>
                  <TabsTrigger value="file">Job Description File</TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <Input
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full mb-6"
                  />
                </TabsContent>

                <TabsContent value="file">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-indigo-500 mb-6">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, setJobDescriptionFile)}
                      className="hidden"
                      id="job-desc-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="job-desc-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <span className="text-indigo-600 hover:text-indigo-500">
                        Upload Job Description File
                      </span>
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      {jobDescriptionFile ? `Selected: ${jobDescriptionFile.name}` : "Drag and drop or click to browse."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-indigo-500 mb-6">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, setResumeFile)}
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-indigo-600 hover:text-indigo-500">
                    Upload Resume
                  </span>
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  {resumeFile ? `Selected: ${resumeFile.name}` : "Drag and drop or click to browse."}
                </p>
              </div>

              <Button
                onClick={handleGenerateCoverLetter}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Cover Letter"}
              </Button>

              {coverLetter && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-6 bg-white rounded-lg shadow-md border"
                >
                  <h3 className="font-semibold mb-4">Generated Cover Letter:</h3>
                  <pre className="whitespace-pre-wrap text-gray-700">{coverLetter}</pre>
                  <Button
                    onClick={handleSaveCoverLetter}
                    className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white"
                    disabled={saveLoading}
                  >
                    <BookmarkPlus className="w-6 h-6 mr-2" />
                    {saveLoading ? "Saving..." : "Save Cover Letter"}
                  </Button>
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