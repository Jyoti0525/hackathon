// src/pages/university/Analytics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartmentAnalytics from './analytics/DepartmentAnalytics';
import SkillsAnalysis from './analytics/SkillsAnalysis';
import RecruitmentTimeline from './analytics/RecruitmentTimeline';
import ComparisonChart from './analytics/ComparisonChart';
import PlacementStats from './analytics/PlacementStats';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    departmentStats: [],
    skillsStats: [],
    placementStats: {},
    recruitmentTimeline: [],
    yearComparison: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/university/analytics');
      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-6 bg-red-100 text-red-600 rounded-lg">
        {error}
        <button 
          onClick={fetchAnalyticsData}
          className="ml-4 text-sm underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">University Analytics</h1>
        <button 
          onClick={fetchAnalyticsData} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Overview Stats */}
      <PlacementStats data={analyticsData.placementStats} />

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DepartmentAnalytics data={analyticsData.departmentStats} />
        <SkillsAnalysis data={analyticsData.skillsStats} />
      </div>

      {/* Timeline and Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RecruitmentTimeline data={analyticsData.recruitmentTimeline} />
        <ComparisonChart data={analyticsData.yearComparison} />
      </div>

      {/* Additional Analytics Section */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Top Performing Department</h3>
            <p className="text-lg font-semibold">
              {analyticsData.departmentStats?.[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Most In-Demand Skill</h3>
            <p className="text-lg font-semibold">
              {analyticsData.skillsStats?.[0]?.skill || 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Average Package Growth</h3>
            <p className="text-lg font-semibold">
              {analyticsData.placementStats?.packageGrowth || '0'}%
            </p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-6 flex justify-end">
        <button 
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mr-4"
          onClick={() => {/* Add export functionality */}}
        >
          Export Report
        </button>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => {/* Add share functionality */}}
        >
          Share Analytics
        </button>
      </div>
    </div>
  );
};

export default Analytics;