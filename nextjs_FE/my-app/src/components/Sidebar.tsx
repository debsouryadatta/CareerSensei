"use client";

import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconBrandTabler, IconSettings, IconUserBolt, IconArrowLeft } from '@tabler/icons-react';
import { Search, FileText, BarChart2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useAuth0 } from '@auth0/auth0-react';


const links = [
  { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler className="h-5 w-5" /> },
  { label: "Search Jobs", href: "/jobsearch", icon: <Search className="h-5 w-5" /> },
  { label: "Generate Cover Letter", href: "/coverletter", icon: <FileText className="h-5 w-5" /> },
  { label: "Resume Score", href: "/resumescore", icon: <BarChart2 className="h-5 w-5" /> },
  { label: "Logout", href: "/", icon: <IconArrowLeft className="h-5 w-5" /> },
];

const Logo = () => (
  <Link
    href="/"
    aria-label="Jobs Portal"
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

const LogoIcon = () => (
  <Link
    href="/"
    aria-label="Jobs Portal Logo"
    className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);

const SidebarComponent = () => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State for the user's name

  const { logout } = useAuth0();
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUserName(name || ""); 
  }, []);

  return (
    <Sidebar 
      open={open} 
      setOpen={setOpen} 
      className="w-full lg:w-64 lg:flex-shrink-0 d "
    >
      <SidebarBody className="justify-between gap-10">

  <div className="flex flex-col flex-1 overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                link.label === "Logout" ? (
                  <div key={idx} onClick={handleLogout}>
                    <SidebarLink key={idx} link={link} />
                    {/* logout */}
                  </div>
                ) : (
                  <SidebarLink key={idx} link={link} />
                )
              ))}
            </div>
          </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <SidebarLink
            link={{
              label: userName || "User", 
              href: "#",
            
              icon: (
                <Image
                  src="/api/placeholder/50/50"
                  className="h-8 w-8 rounded-full"
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
  );
};

export default SidebarComponent;