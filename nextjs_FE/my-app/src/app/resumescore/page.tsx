
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import SidebarComponent from "@/components/Sidebar";
import { CheckCircle2 } from "lucide-react";
import { marked } from "marked";

const ResumeScore = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null); // Added state for file type
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [componentScores, setComponentScores] = useState<Record<string, number> | null>(null);
  const [advice, setAdvice] = useState<string[]>([]);

  const handleFileUpload = (selectedFiles: File[]) => {
    const selectedFile = selectedFiles[0];
    if (!selectedFile) {
      setError("Please select a valid file.");
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload a PDF or image file.");
      setFile(null);
      setFileType(null); // Reset fileType if invalid
      return;
    }

    setFile(selectedFile);
    setFileType(selectedFile.type.includes("pdf") ? "pdf" : "image"); // Set file type
    setScore(null);
    setComponentScores(null);
    setAdvice([]);
    setError("");
  };
  

  const handleAnalyzeResume = async () => {
    if (!file) {
      setError("Please upload a resume file.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType || "");
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/resume/score`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to score resume.");
      }
  
      const data = await response.json();
      setScore(data.data.total_score || 0);
      setComponentScores(data.data.component_scores || {});
  
      // Split the improvement advice string into an array
      const adviceArray =
        typeof data.data.improvement_advice === "string"
          ? data.data.improvement_advice.split("\n").filter((tip) => tip.trim() !== "")
          : [];
      setAdvice(adviceArray);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  

  return (
    <div className="flex flex-col md:flex-row  h-screen">
      <SidebarComponent />
      <div className="flex-1 p-4 lg:p-8 bg-gray-100 dark:bg-neutral-900 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* <Card className="w-full max-w-4xl mx-auto"> */}
          <Card className="w-full shadow-lg dark:bg-neutral-800 
            border dark:border-neutral-700 overflow-hidden">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-center mb-8">Resume Score Analyzer</h1>

              {/* Resume Upload Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Resume
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(Array.from(e.dataTransfer.files));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <span className="text-indigo-600 hover:text-indigo-500">
                      Upload Resume
                    </span>
                    <p className="mt-2 text-sm text-gray-500">
                      {file ? `Selected: ${file.name}` : "Drag and drop your resume here or click to browse."}
                    </p>
                  </label>
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyzeResume}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 font-medium"
                disabled={loading || !file}
              >
                {/* {loading ? "Analyzing..." : "Analyze Resume"} */}
                {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                Analyzing Resume...
              </div>
            ) : (
              <span>Analyze Resume</span>
            )}
              </Button>

              {/* Error Message */}
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}

              {/* Display Results */}
              {score !== null && (
                <div className="space-y-8 animate-in fade-in-50 duration-500 mt-6">
                  {/* Score Display */}
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-semibold">Your Resume Score</h3>
                    <div className="relative w-40 h-40 mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">{score}</span>
                        
                      </div>
                      {/* <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-primary/20"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="62"
                      cx="80"
                      cy="80"
                    />
                    <circle
                      className="text-primary transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={62 * 2 * Math.PI}
                      strokeDashoffset={62 * 2 * Math.PI * (1 - score / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="62"
                      cx="80"
                      cy="80"
                    />
                  </svg> */}

<svg viewBox="0 0 180 180" className="absolute inset-0">
                        <circle
                          cx="90"
                          cy="90"
                          r="80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          className="text-gray-200 dark:text-neutral-700"
                        />
                        <circle
                          cx="90"
                          cy="90"
                          r="80"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeDasharray="502.65"
                          strokeDashoffset={502.65 * (1 - score / 100)}
                          className={`${getScoreColor(score)} transition-all duration-1000`}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Component Scores */}
                  {componentScores && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Score Breakdown</h4>
                      <div className="space-y-3">
                        {Object.entries(componentScores).map(([component, score]) => (
                          <div key={component} className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span>{component}</span>
                              <span className="font-medium">{score} pts</span>
                            </div>
                            <Progress value={score} max={30} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Improvement Advice */}
                  {advice.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Improvement Suggestions</h4>
                      <div className="space-y-2">
                        {advice.map((tip, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            {/* Render Markdown as HTML */}
                            <p
                              className="text-sm"
                              dangerouslySetInnerHTML={{ __html: marked.parse(tip) }}
                            ></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeScore;
