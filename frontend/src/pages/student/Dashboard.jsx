import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
// In pages/company/Dashboard.jsx and pages/student/Dashboard.jsx
import AIServiceDashboard from '../../components/ai/AIServiceDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Assessments</h3>
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-gray-600">Pending assessments</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Skills</h3>
          <p className="text-3xl font-bold text-green-600">12</p>
          <p className="text-sm text-gray-600">Skills in progress</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Applications</h3>
          <p className="text-3xl font-bold text-purple-600">3</p>
          <p className="text-sm text-gray-600">Active job applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Completed Python Assessment</p>
              <p className="text-sm text-gray-600">Score: 85%</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Updated Profile</p>
              <p className="text-sm text-gray-600">Added new skills</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Applied for Job</p>
              <p className="text-sm text-gray-600">Software Developer at TechCorp</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Upcoming Assessments</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">React.js Assessment</p>
              <p className="text-sm text-gray-600">Due in 2 days</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">Database Design</p>
              <p className="text-sm text-gray-600">Due in 5 days</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">System Design</p>
              <p className="text-sm text-gray-600">Due in 1 week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;