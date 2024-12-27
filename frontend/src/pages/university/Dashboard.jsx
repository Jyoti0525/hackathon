// frontend/src/pages/university/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UniversityService from '../../services/universityService';
import DriveManagement from '../../components/drives/DriveManagement';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    averagePackage: "0 LPA",
    activeCompanies: 0
  });
  const [recentPlacements, setRecentPlacements] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await UniversityService.getDashboardStats();
      const { data } = response;
      
      setStats({
        totalStudents: data.totalStudents,
        placedStudents: data.placedStudents,
        averagePackage: `${data.averagePackage} LPA`,
        activeCompanies: data.activeCompanies
      });

      setRecentPlacements(data.recentPlacements.map(placement => ({
        id: placement.id,
        studentName: placement.studentName, // Changed from student.name
        company: placement.company,         // Changed from company.name
        role: placement.role,               // Changed from jobRole.title
        package: placement.package,
        date: placement.date
      })));

      setUpcomingDrives(data.upcomingDrives.map(drive => ({
        id: drive.id,
        company: drive.company,    // Changed from company.name
        date: drive.date,
        roles: drive.roles,        // Changed from jobRoles
        eligibility: drive.eligibility,
        registrations: drive.registrations
      })));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleManageDrive = (driveId) => {
    setSelectedDrive(driveId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-6 text-red-600 bg-red-100 rounded-lg">
        {error}
        <button 
          onClick={fetchDashboardData}
          className="ml-4 text-sm underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">University Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.universityName}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm text-gray-600">Total Students</h3>
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm text-gray-600">Placed Students</h3>
          <p className="text-2xl font-bold text-green-600">{stats.placedStudents}</p>
          <p className="text-sm text-green-600">
            {((stats.placedStudents / stats.totalStudents) * 100).toFixed(1)}% Placement Rate
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm text-gray-600">Average Package</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.averagePackage}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-sm text-gray-600">Active Companies</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.activeCompanies}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Placements */}
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Placements</h2>
              <button 
                onClick={fetchDashboardData}
                className="text-blue-600 hover:text-blue-800"
              >
                <RefreshIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {recentPlacements.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent placements</p>
              ) : (
                recentPlacements.map(placement => (
                  <div key={placement.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{placement.studentName}</h3>
                        <p className="text-sm text-gray-600">{placement.role} at {placement.company}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {placement.package}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Placed on {new Date(placement.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Placement Drives */}
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Placement Drives</h2>
              <button 
                onClick={fetchDashboardData}
                className="text-blue-600 hover:text-blue-800"
              >
                <RefreshIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {upcomingDrives.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming drives</p>
              ) : (
                upcomingDrives.map(drive => (
                  <div key={drive.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{drive.company}</h3>
                        <p className="text-sm text-gray-600">
                          Date: {new Date(drive.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleManageDrive(drive.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Manage Drive
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {drive.roles.map((role, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Eligibility: {drive.eligibility}</span>
                      <span>{drive.registrations} Registrations</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drive Management Modal */}
      {selectedDrive && (
        <DriveManagement 
          driveId={selectedDrive}
          onClose={() => setSelectedDrive(null)}
        />
      )}
    </div>
  );
};

// Simple Refresh Icon Component
const RefreshIcon = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
    />
  </svg>
);

export default Dashboard;