"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// UploadResume Component
const UploadResume = ({ onFileUpload, onSearch }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(newFiles);
      onFileUpload(newFiles);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
      onFileUpload(newFiles);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center relative ${
          dragActive 
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
            : "border-gray-300 dark:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleChange}
          className="hidden"
          id="file-upload"
          multiple
          accept=".pdf,.doc,.docx"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Upload Resume
        </label>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {files.length > 0 
            ? `Selected ${files.length} file${files.length === 1 ? '' : 's'}: ${files.map(f => f.name).join(', ')}`
            : 'Drag and drop your resume here or click to browse'}
        </p>
      </div>
      <Button 
        onClick={onSearch}
        className="w-full bg-indigo-500 text-white px-8 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        disabled={files.length === 0}
      >
        Search Jobs
      </Button>
    </div>
  );
};

// FilterForm Component
const FilterForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Filtering jobs...');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Job Title" />
        <Input placeholder="Location" />
        <Input placeholder="Experience" />
        <Input placeholder="Company" />
        <Input 
          placeholder="Skills (separate with commas)" 
          className="col-span-full"
        />
      </div>
      <Button type="submit" className="w-full bg-indigo-500 text-white px-8 py-2 rounded-lg hover:bg-indigo-600 transition-colors">Search Jobs</Button>
    </form>
  );
};

// Logo Component
const Logo = () => {
  return (
    <Link
      href="#"
      aria-label="Acet Labs"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        Jobs
      </motion.span>
    </Link>
  );
};

// LogoIcon Component
const LogoIcon = () => {
  return (
    <Link
      href="#"
      aria-label="Acet Labs Logo"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Main JobSearch Component
export default function JobSearch() {
  const [files, setFiles] = useState([]);
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

  const handleFileUpload = (newFiles) => {
    setFiles(newFiles);
    console.log("Files uploaded:", newFiles);
  };

  const handleJobSearch = () => {
    if (files.length > 0) {
      console.log("Searching with files:", files);
    } else {
      console.log("No files selected");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
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

      <div className="flex-1 p-8 bg-gray-100 dark:bg-neutral-800">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                Find Jobs
              </h1>
              
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
                  <UploadResume 
                    onFileUpload={handleFileUpload} 
                    onSearch={handleJobSearch}
                  />
                </TabsContent>

                <TabsContent value="filter">
                  <FilterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}