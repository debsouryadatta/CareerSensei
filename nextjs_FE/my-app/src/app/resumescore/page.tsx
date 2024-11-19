"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import SidebarComponent from "@/components/Sidebar";

const ResumeScore = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [score, setScore] = useState(null);
  const [componentScores, setComponentScores] = useState(null);
  const [improvementAdvice, setImprovementAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file upload
  const handleFileUpload = (selectedFiles) => {
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
      setFileType("");
      return;
    }

    setFile(selectedFile);
    setFileType(selectedFile.type.includes("pdf") ? "pdf" : "image");
    setScore(null);
    setComponentScores(null);
    setImprovementAdvice("");
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
    formData.append("file_type", fileType);

    try {
      const response = await fetch("http://localhost:8000/api/v1/resume/score", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to score resume.");
      }

      const data = await response.json();
      setScore(data.data.total_score); // Assuming `total_score` contains the main score
      setComponentScores(data.data.component_scores); // Assuming `component_scores` contains breakdown
      setImprovementAdvice(data.data.improvement_advice); // Assuming `improvement_advice` contains advice
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-neutral-800">
      <SidebarComponent />
      <Card className="w-full max-w-4xl mx-auto">
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
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
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
            {loading ? "Analyzing..." : "Analyze Resume"}
          </Button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-4">
              {error}
            </p>
          )}

          {/* Display Resume Score */}
          {score !== null && (
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Your Resume Score</h3>
              <Progress value={score} max={100} className="mb-4" />
              <p className="text-2xl font-bold">{score} / 100</p>

              {/* Display Component Scores */}
              {componentScores && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Component Scores</h4>
                  <ul className="list-disc list-inside">
                    {Object.entries(componentScores).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value} 
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Display Improvement Advice */}
              {improvementAdvice && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold">Improvement Advice</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {improvementAdvice}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeScore;
