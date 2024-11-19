"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SidebarComponent from "@/components/Sidebar";

const Dashboard = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedCoverLetters, setSavedCoverLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage

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
      const response = await fetch(`http://localhost:8000/api/v1/jobs/${userId}`);
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
      const response = await fetch(`http://localhost:8000/api/v1/cover-letters/${userId}`);
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

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
      <SidebarComponent />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 bg-gray-100 dark:bg-neutral-800 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Error Message */}
          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

          {/* Loading State */}
          {loading && <div className="text-center text-gray-500">Loading...</div>}

          {/* Saved Jobs Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Saved Jobs</h2>
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <Card key={job.id} className="mb-4">
                  <CardContent>
                    <h3 className="font-bold text-lg">{job.job_title}</h3>
                    <p>{job.company}</p>
                    <p>{job.location}</p>
                    <p className="text-sm text-gray-500">{job.job_description}</p>
                    <a
                      href={job.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Apply Now
                    </a>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No saved jobs found.</p>
            )}
          </section>

          {/* Saved Cover Letters Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Saved Cover Letters</h2>
            {savedCoverLetters.length > 0 ? (
              savedCoverLetters.map((coverLetter) => (
                <Card key={coverLetter.id} className="mb-4">
                  <CardContent>
                    <p className="text-sm text-gray-700">{coverLetter.cover_letter}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No saved cover letters found.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
