import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonChart = ({ data }) => {
  const formattedData = [
    {
      metric: 'Total Placements',
      current: data.currentYear.totalPlacements,
      previous: data.previousYear.totalPlacements
    },
    {
      metric: 'Average Package',
      current: parseFloat(data.currentYear.averagePackage),
      previous: parseFloat(data.previousYear.averagePackage)
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Year-over-Year Comparison</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" name="Current Year" fill="#8884d8" />
            <Bar dataKey="previous" name="Previous Year" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;