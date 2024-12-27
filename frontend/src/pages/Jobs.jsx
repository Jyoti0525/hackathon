import React from 'react';
import JobSearch from '../components/job/JobSearch';
import JobAnalytics from '../components/job/JobAnalytics';

const Jobs = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Jobs</h1>
      <JobSearch />
      <JobAnalytics />
    </div>
  );
};

export default Jobs;