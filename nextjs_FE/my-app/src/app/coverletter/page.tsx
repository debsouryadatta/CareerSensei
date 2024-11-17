"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import SidebarComponent from '@/components/Sidebar';

const GenerateCoverLetter = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileUpload = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    
    setLoading(true);
    try {
      const generatedLetter = `Dear Hiring Manager,\n\nBased on the uploaded resume and the job description of ${jobDescription}, I am excited to apply...`;
      setCoverLetter(generatedLetter);
      setError('');
    } catch (error) {
      setError('Failed to generate cover letter');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
        <SidebarComponent />
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-center mb-8">Cover Letter Generator</h1>
            
            {/* Job Description Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full min-h-[150px] p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Resume Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Upload
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
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-indigo-600 hover:text-indigo-500">
                    Upload Resume
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    {files.length > 0
                      ? `Selected: ${files.map(f => f.name).join(', ')}`
                      : 'Drag and drop your resume here or click to browse'}
                  </p>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateCoverLetter}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 font-medium"
              disabled={loading || files.length === 0}
            >
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </Button>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-center mt-4">
                {error}
              </p>
            )}

            {/* Generated Cover Letter */}
            {coverLetter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-6 bg-white rounded-lg shadow-sm border"
              >
                <h3 className="font-semibold mb-4">Generated Cover Letter:</h3>
                <pre className="whitespace-pre-wrap text-gray-700">{coverLetter}</pre>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateCoverLetter;