import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UniversityService from '../../services/universityService';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalStudents: 0,
      totalPlacements: 0,
      averagePackage: '0',
      highestPackage: '0',
      activeCompanies: 0,
      placementRate: '0'
    },
    recentPlacements: [],
    upcomingDrives: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await UniversityService.getDashboardStats();
      
      if (response.success) {
        const { data } = response;
        
        // Format the data with proper type checking
        const formattedData = {
          metrics: {
            totalStudents: parseInt(data.totalStudents || 0),
            totalPlacements: parseInt(data.placedStudents || 0),
            averagePackage: typeof data.averagePackage === 'number' 
              ? data.averagePackage.toFixed(2) 
              : '0.00',
            highestPackage: typeof data.highestPackage === 'number' 
              ? data.highestPackage.toFixed(2) 
              : '0.00',
            activeCompanies: parseInt(data.activeCompanies || 0),
            placementRate: typeof data.placementRate === 'number' 
              ? data.placementRate.toFixed(2) 
              : '0.00'
          },
          recentPlacements: Array.isArray(data.recentPlacements) 
            ? data.recentPlacements.map(placement => ({
                ...placement,
                package: typeof placement.package === 'number' 
                  ? `${placement.package.toFixed(2)} LPA` 
                  : 'N/A'
              }))
            : [],
          upcomingDrives: Array.isArray(data.upcomingDrives) 
            ? data.upcomingDrives 
            : []
        };
  
        setDashboardData(formattedData);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    <div className="p-6  ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">University Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.universityName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600">Total Students</h3>
          <p className="text-2xl font-bold">{dashboardData.metrics.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600">Placed Students</h3>
          <p className="text-2xl font-bold text-green-600">
            {dashboardData.metrics.totalPlacements}
          </p>
          <p className="text-sm text-green-600">
            {dashboardData.metrics.placementRate}% Placement Rate
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600">Average Package</h3>
          <p className="text-2xl font-bold text-blue-600">
            {dashboardData.metrics.averagePackage} LPA
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-gray-600">Active Companies</h3>
          <p className="text-2xl font-bold text-purple-600">
            {dashboardData.metrics.activeCompanies}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Placements</h2>
              <button 
                onClick={fetchDashboardData}
                className="text-blue-600 hover:text-blue-800"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentPlacements.map(placement => (
                <div key={placement.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{placement.studentName}</h3>
                      <p className="text-sm text-gray-600">
                        {placement.role} at {placement.company}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {placement.package}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Placed on {new Date(placement.placementDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Drives</h2>
              <button 
                onClick={fetchDashboardData}
                className="text-blue-600 hover:text-blue-800"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.upcomingDrives.map(drive => (
                <div key={drive.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{drive.company}</h3>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(drive.driveDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/university/drives/${drive.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {drive.roles.map((role, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {role.title}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min. CGPA: {drive.eligibilityCriteria?.minimumCGPA || 'N/A'}</span>
                    <span>{drive.registrationCount} Registrations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;