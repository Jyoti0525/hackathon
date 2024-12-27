// src/pages/university/analytics/DepartmentAnalytics.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DepartmentAnalytics = () => {
  // Sample data - replace with your real data from API
  const data = [
    {
      name: 'Computer Science',
      placedStudents: 150,
      averagePackage: 8.5
    },
    {
      name: 'Electronics',
      placedStudents: 120,
      averagePackage: 7.8
    },
    {
      name: 'Mechanical',
      placedStudents: 90,
      averagePackage: 6.5
    },
    {
      name: 'Information Technology',
      placedStudents: 130,
      averagePackage: 8.2
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Department-wise Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="placedStudents" name="Placed Students" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="averagePackage" name="Average Package (LPA)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentAnalytics;