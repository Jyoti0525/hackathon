import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, TrendingUp, Users, Award } from 'lucide-react';

const DetailedMetricsView = () => {
  const [metrics, setMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState('weekly');
  const [activeTab, setActiveTab] = useState('engagement');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetrics(timeframe);
  }, [timeframe]);

  const fetchMetrics = async (period) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/metrics?timeframe=${period}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!metrics) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const TimeframeButton = ({ value, label }) => (
    <button
      onClick={() => setTimeframe(value)}
      className={`px-4 py-2 rounded-md ${
        timeframe === value
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  const TabButton = ({ value, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center px-4 py-2 rounded-md ${
        activeTab === value
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {label}
    </button>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart className="mr-2 h-6 w-6" />
            Detailed Analytics
          </h2>
          <div className="flex gap-2">
            <TimeframeButton value="weekly" label="Weekly" />
            <TimeframeButton value="monthly" label="Monthly" />
            <TimeframeButton value="yearly" label="Yearly" />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex gap-4 -mb-px">
            <TabButton 
              value="engagement" 
              label="User Engagement"
              icon={Users}
            />
            <TabButton 
              value="performance" 
              label="Performance Metrics"
              icon={TrendingUp}
            />
            <TabButton 
              value="skills" 
              label="Skill Development"
              icon={Award}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg">
          {activeTab === 'engagement' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Engagement Metrics
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.engagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#2563eb" 
                      name="Active Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="assessmentsTaken" 
                      stroke="#16a34a" 
                      name="Assessments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Performance Trends
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="averageScore" 
                      stroke="#2563eb" 
                      name="Avg Score"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completionRate" 
                      stroke="#16a34a" 
                      name="Completion Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Skill Development Analytics
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.skills}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="skillsAcquired" 
                      stroke="#2563eb" 
                      name="New Skills"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="certifications" 
                      stroke="#16a34a" 
                      name="Certifications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900">Total Users</h4>
              <p className="text-2xl font-bold text-blue-600">
                {metrics.summary?.totalUsers?.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900">Success Rate</h4>
              <p className="text-2xl font-bold text-green-600">
                {metrics.summary?.successRate}%
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm font-medium text-purple-900">Total Skills</h4>
              <p className="text-2xl font-bold text-purple-600">
                {metrics.summary?.totalSkills?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedMetricsView;