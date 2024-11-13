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


const JobSearch = () => {
  const [files, setFiles] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("resume");

  const links = [
    {
        label: "Dashboard",
        href: "#",
        icon: (
            <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Profile",
        href: "#",
        icon: (
            <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Settings",
        href: "#",
        icon: (
            <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Logout",
        href: "#",
        icon: (
            <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
];
 


  // // Handle file upload
  // const handleFileUpload = async (newFiles) => {
  //   setFiles(newFiles);
  //   const formData = new FormData();
  //   formData.append('file', newFiles[0]);

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await fetch('http://localhost:8000/api/v1/resume/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });
      
  //     if (!response.ok) throw new Error('Resume upload failed');
  //     const data = await response.json();
  //     setJobMatches(data.job_matches.matches);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle file upload
const handleFileUpload = async (newFiles) => {
  setFiles(newFiles);
  console.log("Selected Files:", newFiles);

  const formData = new FormData();
  formData.append('file', newFiles[0]);

  console.log("FormData:", formData.get('file'));

  try {
    setLoading(true);
    setError(null);

    console.log("Sending request to upload resume...");
    const response = await fetch('http://localhost:8000/api/v1/resume/upload', {
      method: 'POST',
      body: formData,
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      console.error("Resume upload failed");
      throw new Error('Resume upload failed');
    }

    const data = await response.json();
    console.log("Response Data:", data);

    setJobMatches(data.job_matches.matches);
    console.log("Job Matches:", data.job_matches.matches);

  } catch (err) {
    console.error("Error during upload:", err.message);
    setError(err.message);
  } finally {
    setLoading(false);
    console.log("Upload process completed");
  }
};


  // Handle job search
  const handleJobSearch = async (filterData = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/v1/filters/job_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterData),
      });

      if (!response.ok) throw new Error('Job search failed');

      const data = await response.json();
      setJobMatches(data.job_matches.matches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload Resume Component
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
          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
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
        onClick={handleFileUpload}
        className="w-full bg-indigo-500 text-white"
        disabled={files.length === 0}
      >
       Upload and Search Jobs
      </Button>
    </div>
  );

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
        <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600">
          Search Jobs
        </Button>
      </form>
    );
  };

  // Job Card Component
  const JobCard = ({ job }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{job.job_title}</h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <Badge variant="secondary">{job.work_type}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{job.required_experience}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
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

        <p className="text-gray-600 mb-4">{job.job_description}</p>

        <div className="flex justify-end">
          <a
            href={job.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );



  return (

       <div className="flex h-screen">
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        {/* {open ? <Logo /> : <LogoIcon />} */}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Sonika",
                                href: "#",
                                icon: (
                                    <Image
                                        src="/api/placeholder/50/50"
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
     
      <div className="flex-1 p-8 bg-gray-100 dark:bg-neutral-800 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-6 text-center">Find Your Next Job</h1>
              
              <Tabs defaultValue="resume" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="resume"
                    onClick={() => setTab("resume")}
                  >
                    Search by Resume
                  </TabsTrigger>
                  <TabsTrigger 
                    value="filter"
                    onClick={() => setTab("filter")}
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

              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {loading && (
                <div className="mt-4 text-center text-gray-600">
                  Loading...
                </div>
              )}

              {jobMatches.length > 0 && (
                <div className="mt-8 space-y-6">
                  <h2 className="text-xl font-bold mb-4">
                    Found {jobMatches.length} matching positions
                  </h2>
                  {jobMatches.map((job, index) => (
                    <JobCard key={index} job={job} />
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