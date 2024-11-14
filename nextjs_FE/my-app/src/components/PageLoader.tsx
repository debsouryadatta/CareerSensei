import React from "react";
import { LoadingSpinner } from "./ui/loading-spinner";
export const PageLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
    </div>
  );
};
