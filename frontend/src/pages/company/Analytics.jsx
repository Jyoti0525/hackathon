import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('yearly');
  const [selectedMetric, setSelectedMetric] = useState('hiringTrends');

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea'];

  // Sample data
  const hiringTrends = [
    { year: '2020', hires: 120, openings: 150 },
    { year: '2021', hires: 135, openings: 160 },
    { year: '2022', hires: 150, openings: 170 },
    { year: '2023', hires: 145, openings: 165 },
  ];

  const departmentHiring = [
    { department: 'Computer Science', hires: 45 },
    { department: 'Electronics', hires: 30 },
    { department: 'Mechanical', hires: 25 },
    { department: 'Civil', hires: 20 },
  ];

  const universityPerformance = [
    { university: 'IIT Delhi', hires: 50, avgPackage: 20 },
    { university: 'NIT Trichy', hires: 40, avgPackage: 18 },
    { university: 'BITS Pilani', hires: 45, avgPackage: 19 },
    { university: 'IIT Bombay', hires: 55, avgPackage: 22 },
  ];

  const salaryDistribution = [
    { range: '5-10 LPA', employees: 50 },
    { range: '10-15 LPA', employees: 40 },
    { range: '15-20 LPA', employees: 30 },
    { range: '20+ LPA', employees: 20 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Company Analytics Dashboard</h1>
        <p className="text-gray-600">Detailed insights into recruitment and performance trends</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Total Hires</h3>
          <p className="text-2xl font-bold text-blue-600">145</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Open Positions</h3>
          <p className="text-2xl font-bold text-green-600">165</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Top Salary Offered</h3>
          <p className="text-2xl font-bold text-red-600">22 LPA</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Universities Partnered</h3>
          <p className="text-2xl font-bold text-purple-600">15</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="yearly">Yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="hiringTrends">Hiring Trends</option>
            <option value="departmentHiring">Department Hiring</option>
            <option value="universityPerformance">University Performance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Hiring Trends</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hiringTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hires" stroke="#2563eb" name="Hires" />
                <Line type="monotone" dataKey="openings" stroke="#16a34a" name="Open Positions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department-wise Hiring */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Department-wise Hiring</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentHiring}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hires" fill="#2563eb" name="Hires" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Salary Distribution</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salaryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="employees"
                >
                  {salaryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* University Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Universities</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={universityPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="university" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hires" fill="#2563eb" name="Hires" />
                <Bar dataKey="avgPackage" fill="#16a34a" name="Average Package (LPA)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
