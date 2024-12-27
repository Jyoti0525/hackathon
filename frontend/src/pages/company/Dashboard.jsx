import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
// In pages/company/Dashboard.jsx and pages/student/Dashboard.jsx
import AIServiceDashboard from '../../components/ai/AIServiceDashboard';
const Dashboard = () => {
  const { user } = useAuth();

  // Sample data - replace with API integration
  const stats = {
    activeJobs: 12,
    totalApplications: 245,
    shortlisted: 45,
    interviews: 28,
    offersAccepted: 15,
    averagePackage: "12 LPA"
  };

  const recentApplications = [
    {
      id: 1,
      candidateName: "John Doe",
      role: "Software Engineer",
      university: "Tech University",
      skills: ["React", "Node.js", "MongoDB"],
      status: "Shortlisted",
      appliedDate: "2024-01-15"
    },
    {
      id: 2,
      candidateName: "Jane Smith",
      role: "Frontend Developer",
      university: "Engineering College",
      skills: ["React", "TypeScript", "CSS"],
      status: "In Review",
      appliedDate: "2024-01-14"
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidateName: "Mike Johnson",
      role: "Full Stack Developer",
      time: "10:00 AM",
      date: "2024-01-20",
      type: "Technical",
      round: "2nd"
    },
    {
      id: 2,
      candidateName: "Sarah Williams",
      role: "DevOps Engineer",
      time: "2:00 PM",
      date: "2024-01-20",
      type: "System Design",
      round: "1st"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.companyName}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Active Jobs</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.activeJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Applications</h3>
          <p className="text-2xl font-bold">{stats.totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Shortlisted</h3>
          <p className="text-2xl font-bold text-green-600">{stats.shortlisted}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Interviews</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.interviews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Offers Accepted</h3>
          <p className="text-2xl font-bold text-green-600">{stats.offersAccepted}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Average Package</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.averagePackage}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
            <div className="space-y-4">
              {recentApplications.map(application => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{application.candidateName}</h3>
                      <p className="text-sm text-gray-600">{application.role}</p>
                      <p className="text-sm text-gray-500">{application.university}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'Shortlisted' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {application.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Applied on {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Applications →
            </button>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Interviews</h2>
            <div className="space-y-4">
              {upcomingInterviews.map(interview => (
                <div key={interview.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{interview.candidateName}</h3>
                      <p className="text-sm text-gray-600">{interview.role}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(interview.date).toLocaleDateString()} at {interview.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {interview.type}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        Round: {interview.round}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Reschedule
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Join Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Interviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;