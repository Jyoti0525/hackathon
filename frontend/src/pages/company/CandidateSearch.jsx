import React, { useState } from 'react';

const CandidateSearch = () => {
  const [filters, setFilters] = useState({
    skills: '',
    experience: '',
    education: '',
    location: ''
  });

  const candidates = [
    {
      id: 1,
      name: "John Doe",
      university: "Tech University",
      degree: "B.Tech in Computer Science",
      skills: ["React", "Node.js", "Python"],
      experience: "Fresh Graduate",
      location: "New Delhi",
      matchScore: 95
    },
    {
      id: 2,
      name: "Jane Smith",
      university: "Engineering College",
      degree: "B.Tech in Electronics",
      skills: ["Java", "Spring Boot", "SQL"],
      experience: "1 Year",
      location: "Bangalore",
      matchScore: 88
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Candidate Search</h1>
        <p className="text-gray-600">Find the perfect candidates for your positions</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Skills (e.g., React, Python)"
            className="w-full rounded-lg border-gray-300"
            value={filters.skills}
            onChange={(e) => setFilters({...filters, skills: e.target.value})}
          />
          <select
            className="w-full rounded-lg border-gray-300"
            value={filters.experience}
            onChange={(e) => setFilters({...filters, experience: e.target.value})}
          >
            <option value="">Experience Level</option>
            <option value="fresher">Fresher</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
          </select>
          <select
            className="w-full rounded-lg border-gray-300"
            value={filters.education}
            onChange={(e) => setFilters({...filters, education: e.target.value})}
          >
            <option value="">Education</option>
            <option value="btech">B.Tech</option>
            <option value="mtech">M.Tech</option>
            <option value="bca">BCA</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            className="w-full rounded-lg border-gray-300"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>
      </div>

      {/* Candidate List */}
      <div className="grid grid-cols-1 gap-4">
        {candidates.map(candidate => (
          <div key={candidate.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{candidate.name}</h2>
                <p className="text-gray-600">{candidate.degree}</p>
                <p className="text-sm text-gray-500">{candidate.university}</p>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                {candidate.matchScore}% Match
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm"><span className="font-medium">Experience:</span> {candidate.experience}</p>
              <p className="text-sm"><span className="font-medium">Location:</span> {candidate.location}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                View Profile
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Contact Candidate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateSearch;