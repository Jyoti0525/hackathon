// src/pages/university/analytics/SkillsAnalysis.jsx
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const SkillsAnalysis = () => {
  // Sample data - replace with real data from API
  const data = [
    { skill: 'React', value: 85 },
    { skill: 'Node.js', value: 75 },
    { skill: 'Python', value: 90 },
    { skill: 'Java', value: 70 },
    { skill: 'Cloud', value: 65 },
    { skill: 'ML/AI', value: 60 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Skills in Demand</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar 
              name="Demand Level" 
              dataKey="value" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6} 
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillsAnalysis;