"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarComponent from "@/components/Sidebar";
import { ChevronDown, ChevronUp } from 'lucide-react';

const Dashboard = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedCoverLetters, setSavedCoverLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      fetchSavedJobs();
      fetchSavedCoverLetters();
    } else {
      setError("User not logged in. Please log in to view your dashboard.");
    }
  }, [userId]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/jobs/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch saved jobs");
      const data = await response.json();
      setSavedJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCoverLetters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cover_letter/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch saved cover letters");
      const data = await response.json();
      setSavedCoverLetters(data.cover_letters || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id, type) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`]
    }));
  };

  const renderCard = (item, type) => {
    const isExpanded = expandedItems[`${type}-${item.id}`];
    const content = type === 'job' ? item.job_description : item.cover_letter;
    const truncatedContent = content.slice(0, 100) + (content.length > 100 ? '...' : '');

    return (
      <Card key={item.id} className="w-full max-w-4xl mx-auto dark:bg-neutral-800 border dark:border-neutral-700 overflow-hidden mb-4">
        <CardContent className="p-6">
          {type === 'job' && (
            <>
              <h3 className="font-bold text-xl mb-2">{item.job_title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">{item.company}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{item.location}</p>
            </>
          )}
          {type === 'coverLetter' && (
            <h3 className="font-bold text-xl mb-4">Cover Letter #{item.id}</h3>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {isExpanded ? content : truncatedContent}
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-neutral-800 p-4 flex justify-between items-center">
          {type === 'job' && (
            <a
              href={item.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Apply Now
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpand(item.id, type)}
            className="flex items-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Read More
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent />
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Dashboard</h1>

          {error && (
            <div className="p-4 mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="w-full">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Saved Jobs</h2>
                {savedJobs.length > 0 ? (
                  savedJobs.map((job) => renderCard(job, 'job'))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No saved jobs found.</p>
                )}
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Saved Cover Letters</h2>
                {savedCoverLetters.length > 0 ? (
                  savedCoverLetters.map((coverLetter) => renderCard(coverLetter, 'coverLetter'))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No saved cover letters found.</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

