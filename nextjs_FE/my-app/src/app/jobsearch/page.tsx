"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { MapPin, Building2, Clock, Coins, ExternalLink } from 'lucide-react';
import { IconBrandTabler, IconSettings, IconUserBolt, IconArrowLeft } from '@tabler/icons-react';
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Bookmark, BookmarkPlus } from 'lucide-react';
import SidebarComponent from '@/components/Sidebar';


const JobSearch = () => {
  const [files, setFiles] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("resume");

const handleFileUpload = async (newFiles: File[]) => {
  setFiles(newFiles);
  const formData = new FormData();
  formData.append('file', newFiles[0]);
  formData.append('file_type', newFiles[0].type === 'application/pdf' ? 'pdf' : 'image');

  try {
    setLoading(true);
    setError(null);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Resume upload failed');
    }

    const data: ResumeUploadResponse = await response.json();
    
    if (data.success && data.data.job_matches.matches) {
      setJobMatches(data.data.job_matches.matches);
    }

  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
  } finally {
    setLoading(false);
  }
};

const UploadResume = () => (
  <div className="space-y-4">
    <div
      className="border-2 border-dashed rounded-lg p-8 text-center"
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
          ? `Selected: ${files.map(f => f.name).join(', ')}`
          : 'Drag and drop your resume here or click to browse'}
      </p>
    </div>
    
    <Button
      onClick={() => handleFileUpload(files)}
      className="w-full bg-indigo-500 text-white"
      disabled={files.length === 0}
    >
     Upload and Search Jobs
    </Button>
  </div>
);


// Handle job search
const handleJobSearch = async (filterData = {}) => {
  console.log("Starting job search with filter data:", filterData);
  
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/filters/job_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterData),
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
      console.error("Job search failed:", response.statusText);
      throw new Error('Job search failed');
    }
    const data = await response.json();
    console.log("Received data from server:", data);
    if (data.job_matches && data.job_matches.matches) {
      setJobMatches(data.job_matches.matches);
      console.log("Job matches found:", data.job_matches.matches);
    } else {
      console.warn("No job matches found in response");
    }
  } catch (err) {
    console.error("Error during job search:", err.message);
    setError(err.message);
  } finally {
    setLoading(false);
    console.log("Job search completed");
  }
};


const handleSaveJob = async (job) => {
  const userId = localStorage.getItem('user_id');
  console.log('userId:', userId);

  if (!userId) {
    alert('Please log in to save jobs');
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/jobs/save/${userId}`, { // Updated URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });

    if (response.ok) {
      alert('Job saved successfully!');
    } else {
      const errorData = await response.json();
      console.error('Failed to save job:', errorData);
      alert('Failed to save job');
    }
  } catch (error) {
    console.error('Error saving job:', error);
    alert('Error saving job');
  }
};

  // Filter Form Component
  const FilterForm = () => {
    const [filters, setFilters] = useState({
      job_title: '',
      required_experience: '',
      technologies: '',
      work_type: 'Remote',
      location: '',
      company: '',
      salary_range: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const formattedFilters = {
        ...filters,
        technologies: filters.technologies.split(',').map(t => t.trim())
      };
      handleJobSearch(formattedFilters);
    };



    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Job Title"
            value={filters.job_title}
            onChange={(e) => setFilters({...filters, job_title: e.target.value})}
          />
          <Input 
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
          <Input 
            placeholder="Experience"
            value={filters.required_experience}
            onChange={(e) => setFilters({...filters, required_experience: e.target.value})}
          />
          <Input 
            placeholder="Company"
            value={filters.company}
            onChange={(e) => setFilters({...filters, company: e.target.value})}
          />
          <Input 
            placeholder="Technologies (separate with commas)"
            className="col-span-full"
            value={filters.technologies}
            onChange={(e) => setFilters({...filters, technologies: e.target.value})}
          />
        </div>
        <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
          Search Jobs
        </Button>
      </form>
    );
  };


  // Job Card Component
const JobCard = ({ job, onSave }) => (
  <Card className="mb-4 bg-neutral-800 text-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{job.job_title}</h3>
          <div className="flex items-center space-x-2 text-gray-400">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
        </div>
        <Badge variant="secondary">{job.work_type}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{job.required_experience}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Coins className="w-4 h-4" />
          <span>{job.salary_range}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Technologies:</h4>
        <div className="flex flex-wrap gap-2">
          {job.technologies.map((tech, index) => (
            <Badge key={index} variant="outline">{tech}</Badge>
          ))}
        </div>
      </div>

      <p className="text-gray-400 mb-4">{job.job_description}</p>

      {/* Apply Now and Save Button */}
  

<div className="flex justify-between items-center">
  {/* Apply Now Button */}
  <a
    href={job.application_link}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
  >
    <span>Apply Now</span>
    <ExternalLink className="w-4 h-4" />
  </a>

  {/* Save Button with Icon */}
  <button
      onClick={() => onSave(job)}
      className="text-indigo-600 hover:text-indigo-500 bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors"
    >
      <BookmarkPlus className="w-6 h-6" />
    </button>
</div>

    </CardContent>
  </Card>

  );

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar Section */}
      <SidebarComponent />
      
      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-8 bg-gray-100 dark:bg-neutral-800 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* <Card className="shadow-lg"> */}
          <Card className="w-full max-w-4xl mx-auto dark:backdrop-blur-xl dark:bg-black/10 border dark:border-white/10 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <CardContent className="p-4 lg:p-6">
              <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center">
                Find Your Next Job
              </h1>
  
              {/* Tabs Section */}
              <Tabs defaultValue="resume" className="w-full">
                <TabsList className="grid w-full grid-cols-2 gap-2 lg:gap-0 mb-4 lg:mb-6">
                  <TabsTrigger
                    value="resume"
                    onClick={() => setTab("resume")}
                    className="text-sm lg:text-base"
                  >
                    Search by Resume
                  </TabsTrigger>
                  <TabsTrigger
                    value="filter"
                    onClick={() => setTab("filter")}
                    className="text-sm lg:text-base"
                  >
                    Search by Filters
                  </TabsTrigger>
                </TabsList>
  
                <TabsContent value="resume">
                  <UploadResume />
                </TabsContent>
  
                <TabsContent value="filter">
                  <FilterForm />
                </TabsContent>
              </Tabs>
  
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
  
              {/* Loading Indicator */}
              {loading && (
                <div className="mt-4 text-center text-gray-600">
                  Loading...
                </div>
              )}
  
              {/* Job Matches */}
              {jobMatches.length > 0 && (
                <div className="mt-8 space-y-6">
                  <h2 className="text-lg lg:text-xl font-bold mb-4">
                    Found {jobMatches.length} matching positions
                  </h2>
                  {jobMatches.map((job, index) => (
                  <JobCard 
                    key={index} 
                    job={job} 
                    onSave={handleSaveJob}
                    className="w-full" 
                  />
                ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  
};

export default JobSearch;