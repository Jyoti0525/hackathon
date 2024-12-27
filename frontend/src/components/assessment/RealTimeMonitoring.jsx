import React, { useState, useEffect } from 'react';
import { Eye, AlertTriangle, Clock, Users } from 'lucide-react';

const RealTimeMonitoring = () => {
  const [activeAssessments, setActiveAssessments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActiveAssessments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/assessment/active');
        const data = await response.json();
        setActiveAssessments(data);
      } catch (error) {
        console.error('Failed to fetch assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAssessments();
    const interval = setInterval(fetchActiveAssessments, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      flagged: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Eye className="mr-2 h-6 w-6" />
            Real-Time Assessment Monitoring
          </h2>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
            {activeAssessments.length} Active
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeAssessments.map((assessment) => (
              <div key={assessment.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {assessment.studentName}
                    </h3>
                    <p className="text-gray-600">
                      {assessment.assessmentType}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full ${getStatusColor(assessment.status)}`}>
                    {assessment.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{assessment.duration} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    Progress: {assessment.progress}%
                  </div>
                  <div>
                    Questions: {assessment.completedQuestions}/{assessment.totalQuestions}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${assessment.progress}%` }}
                    />
                  </div>
                </div>

                {assessment.flags && assessment.flags.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="font-medium text-red-700">Detected Issues</span>
                    </div>
                    {assessment.flags.map((flag, index) => (
                      <p key={index} className="text-sm text-red-600 ml-6">
                        • {flag}
                      </p>
                    ))}
                  </div>
                )}

                {/* Real-time Activity Feed */}
                {assessment.activities && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {assessment.activities.map((activity, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-20 text-gray-500">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </span>
                          <span>{activity.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {activeAssessments.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No active assessments at the moment
              </div>
            )}
          </div>
        )}

        {alerts.length > 0 && (
          <div className="mt-6">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className="p-4 mb-2 bg-red-50 border border-red-200 text-red-700 rounded-md"
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeMonitoring;