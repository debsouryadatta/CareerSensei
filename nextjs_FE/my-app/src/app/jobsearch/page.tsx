"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { FileUpload } from "../../components/ui/file-upload";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface Link {
  label: string;
  href: string;
  icon: JSX.Element;
}

export default function JobSearch() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log("Uploaded files: ", files); // Use the files here or in the search function
  };

  const links: Link[] = [
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

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("resume");

  const handleSearchJob = () => {
    if (files.length > 0) {
      // Implement your search job logic using the files
      console.log("Searching job with files: ", files);
    } else {
      console.log("No files uploaded");
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
                    src="https://assets.aceternity.com/manu.png"
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Find Jobs
          </h1>
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-6 py-2 rounded-lg ${
                tab === "resume"
                  ? "bg-indigo-500 text-white"
                  : "bg-white dark:bg-neutral-700"
              }`}
              onClick={() => setTab("resume")}
            >
              by resume
            </button>
            <button
              className={`px-6 py-2 rounded-lg ${
                tab === "filter"
                  ? "bg-indigo-500 text-white"
                  : "bg-white dark:bg-neutral-700"
              }`}
              onClick={() => setTab("filter")}
            >
              by filtering
            </button>
          </div>

          {tab === "resume" ? (
            <UploadResume onFileUpload={handleFileUpload} onSearch={handleSearchJob} />
          ) : (
            <FilterForm />
          )}
        </div>
      </div>
    </div>
  );
}

const UploadResume = ({
  onFileUpload,
  onSearch,
}: {
  onFileUpload: (files: File[]) => void;
  onSearch: () => void;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={onFileUpload} />
      </div>
      <button
        className="mt-4 bg-indigo-500 text-white px-8 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        onClick={onSearch}
      >
        Search job
      </button>
    </div>
  );
};

const FilterForm = () => {
  return (
    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Profile"
          className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
        />
        <input
          type="text"
          placeholder="Location"
          className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
        />
        <input
          type="text"
          placeholder="Experience"
          className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
        />
        <input
          type="text"
          placeholder="Company"
          className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
        />
        <input
          type="text"
          placeholder="Technologies"
          className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md col-span-1 sm:col-span-2"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button className="bg-indigo-500 text-white px-8 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
          Search job
        </button>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <Link
      href="#"
      aria-label="Acet Labs"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Jobs
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      aria-label="Acet Labs Logo"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
