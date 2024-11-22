"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarComponent from "@/components/Sidebar";
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedCoverLetters, setSavedCoverLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const { isAuthenticated } = useAuth0()
  useEffect(() => {
    if(!isAuthenticated){
      router.replace('/')
    }
    const id = window.localStorage.getItem("user_id");
    setUserId(id);
  }, [isAuthenticated]);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/jobs/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cover_letter/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
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

  const deleteItem = async (id, type) => {
    try {
      setLoading(true);
      const endpoint = type === "job" ? `/api/v1/jobs/${id}` : `/api/v1/cover_letter/${id}`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete item");

      if (type === "job") {
        setSavedJobs((prev) => prev.filter((item) => item.id !== id));
      } else {
        setSavedCoverLetters((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id, type) => {
    setExpandedItems((prev) => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`],
    }));
  };

  const renderCard = (item, type) => {
    const isExpanded = expandedItems[`${type}-${item.id}`];
    const content = type === "job" ? item.job_description : item.cover_letter;
    const truncatedContent = content.slice(0, 100) + (content.length > 100 ? "..." : "");

    return (
      <Card key={item.id} className="w-full max-w-4xl mx-auto dark:bg-neutral-800 border dark:border-neutral-700 overflow-hidden mb-4">
        <CardContent className="p-6">
          {type === "job" && (
            <>
              <h3 className="font-bold text-xl mb-2">{item.job_title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">{item.company}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{item.location}</p>
            </>
          )}
          {type === "coverLetter" && <h3 className="font-bold text-xl mb-4">Cover Letter #{item.id}</h3>}
          <p className="text-sm text-gray-700 dark:text-gray-300">{isExpanded ? content : truncatedContent}</p>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-neutral-800 p-4 flex justify-between items-center">
          {type === "job" && (
            <a
              href={item.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Apply Now
            </a>
          )}
          <div className="flex space-x-4">
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Delete {type}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this {type}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the {type} from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteItem(item.id, type)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (

  <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-neutral-900">
  <SidebarComponent />
  <main className="w-full md:flex-1"> 
    <div className="h-full p-4 lg:p-8 overflow-y-auto"> 
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
                  savedJobs.map((job) => renderCard(job, "job"))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No saved jobs found.</p>
                )}
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Saved Cover Letters</h2>
                {savedCoverLetters.length > 0 ? (
                  savedCoverLetters.map((coverLetter) => renderCard(coverLetter, "coverLetter"))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No saved cover letters found.</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </main>
    </div>
  );
};

export default Dashboard;
