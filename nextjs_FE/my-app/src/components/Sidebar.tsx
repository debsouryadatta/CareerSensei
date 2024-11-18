"use client";

import React from "react";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

const Sidebar = ({ open, setOpen }) => {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
    },
  ];

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} shadow-lg`}>
      <SidebarBody className="flex flex-col justify-between h-full">
        <div className="mt-8">
          <h2 className="text-center text-xl font-bold text-gray-800 dark:text-white">Menu</h2>
          <div className="flex flex-col mt-4">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>

        <div className="p-4">
          <Link href="/profile" className="flex items-center space-x-2">
            <Image src="/api/placeholder/50/50" alt="User Avatar" width={50} height={50} className="rounded-full" />
            <span className="text-gray-800 dark:text-white">Sonika</span>
          </Link>
        </div>
      </SidebarBody>
    </div>
  );
};

export default Sidebar;
