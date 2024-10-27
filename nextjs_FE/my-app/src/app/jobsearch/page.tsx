// // app/page.tsx

"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/utils/cn";

// Define the Link interface
interface Link {
  label: string;
  href: string;
  icon: JSX.Element;
}

export default function JobSearch() {
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Find Jobs
        </h1>
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-tl-lg rounded-tr-lg ${
              tab === "resume"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-neutral-700"
            }`}
            onClick={() => setTab("resume")}
          >
            by resume
          </button>
          <button
            className={`px-4 py-2 rounded-tl-lg rounded-tr-lg ${
              tab === "filter"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-neutral-700"
            }`}
            onClick={() => setTab("filter")}
          >
            by filtering
          </button>
        </div>

        {tab === "resume" ? <UploadResume /> : <FilterForm />}
      </div>
    </div>
  );
}

// const UploadResume = () => {
//   return (
//     <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
//       <div className="border-dashed border-2 border-gray-300 dark:border-neutral-500 rounded-lg p-6 flex justify-center items-center h-40">
//         <span className="text-gray-600 dark:text-gray-300">
//           Upload your resume
//         </span>
//       </div>
//       <button className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg">
//         Search job
//       </button>
//     </div>
//   );
// };

// const FilterForm = () => {
//   return (
//     <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <input
//           type="text"
//           placeholder="Profile"
//           className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
//         />
//         <input
//           type="text"
//           placeholder="Location"
//           className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
//         />
//         <input
//           type="text"
//           placeholder="Experience"
//           className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
//         />
//         <input
//           type="text"
//           placeholder="Company"
//           className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md"
//         />
//         <input
//           type="text"
//           placeholder="Technologies"
//           className="p-2 border border-gray-300 dark:border-neutral-500 rounded-md col-span-1 sm:col-span-2"
//         />
//       </div>
//       <button className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg">
//         Search job
//       </button>
//     </div>
//   );
// };

const UploadResume = () => {
  return (
    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
      <div className="border-dashed border-2 border-gray-300 dark:border-neutral-500 rounded-lg p-6 flex justify-center items-center h-40">
        <span className="text-gray-600 dark:text-gray-300">
          Upload your resume
        </span>
      </div>
      <button className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg">
        Search job
      </button>
    </div>
  );
};

const FilterForm = () => {
  return (
    <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
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
      <button className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg">
        Search job
      </button>
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

