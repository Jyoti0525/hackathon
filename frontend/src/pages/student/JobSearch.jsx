import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const JobSearch = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    experience: ''
  });

  // Sample job data - replace with API integration
  const jobs = [
    {
      id: 1,
      title: 'Software Developer',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000 - $100,000',
      description: 'Looking for a skilled software developer...',
      skills: ['React', 'Node.js', 'MongoDB'],
      posted: '2 days ago',
      matchPercentage: 95
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'Startup Inc',
      location: 'New York',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      description: 'Join our fast-growing team...',
      skills: ['React', 'TypeScript', 'CSS'],
      posted: '1 week ago',
      matchPercentage: 85
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Job Search</h1>
        <p className="text-gray-600">Find the perfect job match for your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Location</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Experience Level</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {job.matchPercentage}% Match
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {job.location}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Type:</span> {job.type}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Salary:</span> {job.salary}
              </div>
            </div>

            <p className="text-gray-600 mb-4">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Posted {job.posted}</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;