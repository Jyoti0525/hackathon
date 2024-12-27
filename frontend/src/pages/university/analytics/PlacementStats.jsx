// src/pages/university/analytics/PlacementStats.jsx
import React from 'react';

const PlacementStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total Students</h3>
        <p className="text-2xl font-bold">2500</p>
        <span className="text-green-500 text-sm">↑ 12% from last year</span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Average Package</h3>
        <p className="text-2xl font-bold">8.5 LPA</p>
        <span className="text-green-500 text-sm">↑ 8% from last year</span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Companies Visited</h3>
        <p className="text-2xl font-bold">45</p>
        <span className="text-blue-500 text-sm">+3 new this year</span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Highest Package</h3>
        <p className="text-2xl font-bold">15 LPA</p>
        <span className="text-purple-500 text-sm">Tech Corp</span>
      </div>
    </div>
  );
};

export default PlacementStats;