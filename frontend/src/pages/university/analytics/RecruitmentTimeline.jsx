import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecruitmentTimeline = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recruitment Timeline</h2>
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