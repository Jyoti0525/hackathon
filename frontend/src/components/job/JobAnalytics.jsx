import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Briefcase, Users, Target } from 'lucide-react';

const JobAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, selectedIndustry]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/jobs/analytics?timeframe=${timeframe}&industry=${selectedIndustry}`
      );
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch job analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!analyticsData) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2 h-6 w-6" />
            Job Market Analytics
          </h2>
          <div className="flex gap-4">
            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="all">All Industries</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
            </select>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-4 py-2 rounded-md ${
                timeframe === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('quarterly')}
              className={`px-4 py-2 rounded-md ${
                timeframe === 'quarterly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <TabButton value="trends" label="Market Trends" icon={TrendingUp} />
          <TabButton value="skills" label="Skill Demand" icon={Target} />
          <TabButton value="salaries" label="Salary Analysis" icon={Users} />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg">
          {activeTab === 'trends' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Job Market Trends
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="jobPostings" 
                      stroke="#2563eb" 
                      name="Job Postings"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#16a34a" 
                      name="Applications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900">Total Jobs</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {analyticsData.summary.totalJobs.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900">Placement Rate</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {analyticsData.summary.placementRate}%
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-900">Avg Time to Hire</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {analyticsData.summary.avgTimeToHire} days
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="mr-2 h-5 w-5" />
                In-Demand Skills
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.skillDemand}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="demand" fill="#2563eb" name="Demand Score" />
                    <Bar dataKey="growth" fill="#16a34a" name="Growth Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Emerging Skills</h4>
                <div className="grid grid-cols-2 gap-4">
                  {analyticsData.emergingSkills.map((skill, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-green-600">+{skill.growthRate}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salaries' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Salary Trends
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.salaryTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="avgSalary" 
                      stroke="#2563eb" 
                      name="Average Salary"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="medianSalary" 
                      stroke="#16a34a" 
                      name="Median Salary"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Salary by Experience</h4>
                  <div className="space-y-2">
                    {analyticsData.salaryByExperience.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.level}</span>
                        <span className="font-medium">${item.salary.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Top Paying Skills</h4>
                  <div className="space-y-2">
                    {analyticsData.topPayingSkills.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.skill}</span>
                        <span className="font-medium">+${item.premium.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobAnalytics;