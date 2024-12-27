import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';

const AIAssessmentDashboard = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAssessmentData();
    const interval = setInterval(fetchAssessmentData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAssessmentData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assessment/data');
      const data = await response.json();
      setAssessmentData(data.assessments);
      setStats(data.stats);
    } catch (err) {
      setError('Failed to fetch assessment data');
    } finally {
      setLoading(false);
    }
  };

  const startNewAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assessment/start', {
        method: 'POST'
      });
      const data = await response.json();
      setCurrentAssessment(data);
      await fetchAssessmentData();
    } catch (err) {
      setError('Failed to start new assessment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      inProgress: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="mr-2 h-6 w-6" />
            AI Assessment Dashboard
          </h2>
          <button
            onClick={startNewAssessment}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Start New Assessment
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900">Total Assessments</h4>
              <p className="text-2xl font-bold text-blue-600">{stats.totalAssessments}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900">Success Rate</h4>
              <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900">Avg. Duration</h4>
              <p className="text-2xl font-bold text-yellow-600">{stats.avgDuration} min</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm font-medium text-purple-900">Active Users</h4>
              <p className="text-2xl font-bold text-purple-600">{stats.activeUsers}</p>
            </div>
          </div>
        )}

        {/* Current Assessment */}
        {currentAssessment && (
          <div className="mb-6 p-4 border rounded-lg bg-white">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Clock className="mr-2 h-5 w-5" />
              Current Assessment
            </h3>
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Subject: {currentAssessment.subject}</p>
                  <p className="text-gray-600">Level: {currentAssessment.level}</p>
                </div>
                <span className={`px-3 py-1 rounded-full ${getStatusColor(currentAssessment.status)}`}>
                  {currentAssessment.status}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentAssessment.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Progress: {currentAssessment.progress}%</p>
            </div>
          </div>
        )}

        {/* Assessment History Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Assessment History</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  name="Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#16a34a" 
                  name="Average Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Assessments */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Assessments</h3>
          <div className="grid gap-4">
            {assessmentData.slice(0, 5).map((assessment, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{assessment.subject}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(assessment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">
                      {assessment.score}%
                    </span>
                    {assessment.score >= 70 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssessmentDashboard;