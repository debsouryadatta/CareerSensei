// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const FilterForm = ({ setJobMatches }) => {
//   const [filters, setFilters] = useState({
//     job_title: "",
//     location: "",
//     experience: "",
//     company: "",
//     skills: "",
//   });

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const response = await fetch("http://localhost:8000/api/v1/filters/job_search", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(filters),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setJobMatches(data.job_matches.matches);
//     }
//   };

//   return (
//     <form onSubmit={handleSearch} className="space-y-4">
//       <Input name="job_title" placeholder="Job Title" />
//       <Button type="submit">Search Jobs</Button>
//     </form>
//   );
// };

// export default FilterForm;


"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FilterFormProps = {
  handleJobSearch: (filterData: any) => void;
};

const FilterForm = ({ handleJobSearch }: FilterFormProps) => {
  const [filters, setFilters] = useState({
    job_title: "",
    location: "",
    required_experience: "",
    technologies: "",
    work_type: "Remote",
    company: "",
    salary_range: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedFilters = {
      ...filters,
      technologies: filters.technologies.split(",").map((tech) => tech.trim()),
    };
    handleJobSearch(formattedFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="job_title"
          placeholder="Job Title"
          value={filters.job_title}
          onChange={handleChange}
        />
        <Input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />
        <Input
          name="required_experience"
          placeholder="Experience"
          value={filters.required_experience}
          onChange={handleChange}
        />
        <Input
          name="company"
          placeholder="Company"
          value={filters.company}
          onChange={handleChange}
        />
        <Input
          name="technologies"
          placeholder="Technologies (comma-separated)"
          value={filters.technologies}
          onChange={handleChange}
          className="col-span-full"
        />
      </div>
      <Button type="submit" className="w-full bg-indigo-500 text-white">
        Search Jobs
      </Button>
    </form>
  );
};

export default FilterForm;
