import React, { useState } from 'react';
// In pages/company/JobManagement.jsx
import JobAnalytics from '../../components/job/JobAnalytics';
import JobMatchingService from '../../components/job/JobMatchingService';
import JobPosting from '../../components/job/JobPosting';

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      type: "Full-time",
      location: "Remote",
      applications: 45,
      status: "active",
      postedDate: "2024-01-10",
      requirements: ["5+ years experience", "React", "Node.js"],
      salary: "18-22 LPA"
    },
    {
      id: 2,
      title: "Product Manager",
      type: "Full-time",
      location: "Bangalore",
      applications: 32,
      status: "active",
      postedDate: "2024-01-12",
      requirements: ["3+ years experience", "Agile", "Product Development"],
      salary: "20-25 LPA"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Management</h1>
          <p className="text-gray-600">Create and manage job postings</p>
        </div>
        <button
          onClick={() => setShowNewJobForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Post New Job
        </button>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Active Jobs</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Total Applications</h3>
          <p className="text-2xl font-bold">245</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Interviews Scheduled</h3>
          <p className="text-2xl font-bold text-green-600">28</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Positions Filled</h3>
          <p className="text-2xl font-bold text-purple-600">15</p>
        </div>
      </div>

      {/* Job Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-6">
          <div className="flex space-x-6">
            {['active', 'draft', 'closed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Jobs
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-6">
          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <p className="text-gray-600">{job.type} · {job.location}</p>
                    <p className="text-sm text-gray-500">Posted on {new Date(job.postedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100">
                      Close
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requirements.map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {req}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-4">
                    <span>Applications: {job.applications}</span>
                    <span>Salary: {job.salary}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    View Applications →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Job Form Modal */}
      {showNewJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            {/* Add your job form here */}
            <h2 className="text-lg font-semibold mb-4">Post New Job</h2>
            {/* Form fields */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowNewJobForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Post Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;