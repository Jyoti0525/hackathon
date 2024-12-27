import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// In pages/student/Assessments.jsx
import AIAssessmentDashboard from '../../components/assessment/AIAssessmentDashboard';
import AssessmentManagement from '../../components/assessment/AssessmentManagement';
import RealTimeMonitoring from '../../components/assessment/RealTimeMonitoring';
import ResultAnalysis from '../../components/assessment/ResultAnalysis';
import SkillAssessment from '../../components/assessment/SkillAssessment';
import TestGenerator from '../../components/assessment/TestGenerator';

const Assessments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'all', label: 'All Assessments' }
  ];

  // Sample data - replace with actual API calls
  const assessments = {
    upcoming: [
      { id: 1, title: 'React Development', date: '2024-01-15', duration: '60 mins', status: 'pending' },
      { id: 2, title: 'Node.js Basics', date: '2024-01-18', duration: '45 mins', status: 'pending' }
    ],
    completed: [
      { id: 3, title: 'JavaScript Fundamentals', date: '2024-01-10', score: '85%', status: 'completed' },
      { id: 4, title: 'Python Programming', date: '2024-01-05', score: '92%', status: 'completed' }
    ]
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <p className="text-gray-600">Track and manage your skill assessments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Total Assessments</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Average Score</h3>
          <p className="text-2xl font-bold text-green-600">88%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Pending</h3>
          <p className="text-2xl font-bold text-blue-600">3</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assessment List */}
        <div className="p-6">
          <div className="space-y-4">
            {(activeTab === 'all' 
              ? [...assessments.upcoming, ...assessments.completed]
              : assessments[activeTab]
            ).map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{assessment.title}</h3>
                  <p className="text-sm text-gray-600">
                    Date: {assessment.date}
                    {assessment.duration && ` • Duration: ${assessment.duration}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {assessment.score && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Score: {assessment.score}
                    </span>
                  )}
                  {assessment.status === 'pending' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Start Assessment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessments;