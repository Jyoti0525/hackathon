// src/pages/university/analytics/RecruitmentTimeline.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecruitmentTimeline = () => {
  const data = [
    { month: 'Jan', placements: 20, offers: 25 },
    { month: 'Feb', placements: 15, offers: 18 },
    { month: 'Mar', placements: 25, offers: 30 },
    { month: 'Apr', placements: 30, offers: 35 },
    { month: 'May', placements: 22, offers: 28 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recruitment Timeline</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="placements" stroke="#8884d8" name="Placements" />
            <Line type="monotone" dataKey="offers" stroke="#82ca9d" name="Offers" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecruitmentTimeline;