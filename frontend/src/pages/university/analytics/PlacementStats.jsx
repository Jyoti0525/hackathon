import React from 'react';

const PlacementStats = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">Total Students</h3>
        <p className="text-2xl font-bold">{data.totalStudents}</p>
        <p className="text-sm text-green-600">+{((data.totalStudents / data.previousYearTotal - 1) * 100).toFixed(1)}% from last year</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">Average Package</h3>
        <p className="text-2xl font-bold">{data.averagePackage} LPA</p>
        <p className="text-sm text-green-600">↑ {data.packageGrowth}% from last year</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">Companies Visited</h3>
        <p className="text-2xl font-bold">{data.companiesVisited}</p>
        <p className="text-sm text-blue-600">+{data.newCompanies} new this year</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">Highest Package</h3>
        <p className="text-2xl font-bold">{data.highestPackage} LPA</p>
        <p className="text-sm text-purple-600">{data.highestPackageCompany}</p>
      </div>
    </div>
  );
};

export default PlacementStats;