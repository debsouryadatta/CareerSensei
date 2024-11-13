"use client";

import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

const Badge = ({ children, className = "" }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full bg-indigo-500 text-white text-sm ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
