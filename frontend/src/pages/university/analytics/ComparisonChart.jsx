// src/pages/university/analytics/ComparisonChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonChart = () => {
  const data = [
    {
      category: 'Total Placements',
      currentYear: 450,
      previousYear: 380
    },
    {
      category: 'Average Package',
      currentYear: 8.5,
      previousYear: 7.8
    },
    {
      category: 'Companies',
      currentYear: 45,
      previousYear: 40
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Year-over-Year Comparison</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="currentYear" fill="#8884d8" name="Current Year" />
            <Bar dataKey="previousYear" fill="#82ca9d" name="Previous Year" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;