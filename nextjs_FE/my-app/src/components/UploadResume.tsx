"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type UploadResumeProps = {
  setJobMatches: (matches: any[]) => void;
};

const UploadResume = ({ setJobMatches }: UploadResumeProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(newFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      setLoading(true);
      setUploadStatus(null);

      const response = await fetch("http://localhost:8000/api/v1/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading resume");
      }

      const data = await response.json();
      setUploadStatus("Resume uploaded successfully!");
      setJobMatches(data.job_matches.matches);
    } catch (error) {
      setUploadStatus("Error uploading resume");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center relative ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleChange}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-indigo-600 hover:text-indigo-500"
        >
          Upload Resume
        </label>
        <p className="mt-2 text-sm text-gray-500">
          {files.length > 0
            ? `Selected ${files.length} file${files.length === 1 ? "" : "s"}: ${files
                .map((f) => f.name)
                .join(", ")}`
            : "Drag and drop your resume here or click to browse"}
        </p>
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        className="w-full bg-indigo-500 text-white"
        disabled={files.length === 0 || loading}
      >
        {loading ? "Uploading..." : "Upload and Search Jobs"}
      </Button>

      {/* Upload status message */}
      {uploadStatus && (
        <p className={`mt-4 ${uploadStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default UploadResume;
