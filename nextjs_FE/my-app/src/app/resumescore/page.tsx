"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import SidebarComponent from '@/components/Sidebar';

const ResumeScore = () => {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file upload
  const handleFileUpload = (selectedFiles) => {
    setFile(selectedFiles[0]);
    setScore(null);
    setError('');
  };

  const handleAnalyzeResume = async () => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Make the API call to get the resume score
      const response = await fetch('http://localhost:8000/api/v1/resume/score', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setScore(data.score);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
        <SidebarComponent />
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Resume Score Analyzer</h1>

          {/* Resume Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <span className="text-indigo-600 hover:text-indigo-500">Upload Resume</span>
                <p className="mt-2 text-sm text-gray-500">
                  {file ? `Selected: ${file.name}` : 'Drag and drop your resume here or click to browse'}
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
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          {/* Display Resume Score */}
          {score !== null && (
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Your Resume Score</h3>
              <Progress value={score} max={100} className="mb-4" />
              <p className="text-2xl font-bold">{score} / 100</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeScore;
