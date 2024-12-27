import React, { useState, useEffect } from 'react';
import { Brain, Activity, AlertTriangle, RefreshCw } from 'lucide-react';

const AIServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceStatus();
    const interval = setInterval(fetchServiceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchServiceStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/status');
      const data = await response.json();
      setServices(data.services);
      setMetrics(data.metrics);
      setError(null);
    } catch (error) {
      setError('Failed to fetch AI service status');
      console.error('Failed to fetch AI service status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="mr-2 h-6 w-6" />
            AI Services Dashboard
          </h2>
          <button 
            onClick={fetchServiceStatus}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid gap-6">
          {services.map((service) => (
            <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <span className={`px-3 py-1 rounded-full ${
                  service.status === 'operational' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="font-medium">{service.uptime}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Time</p>
                  <p className="font-medium">{service.responseTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requests/min</p>
                  <p className="font-medium">{service.requestRate}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">API Usage</span>
                  <span className="text-sm text-gray-600">
                    {service.currentUsage}/{service.limit} calls
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(service.currentUsage / service.limit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Alerts Section */}
              {service.alerts && service.alerts.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="font-medium">Active Alerts</span>
                  </div>
                  {service.alerts.map((alert, index) => (
                    <p key={index} className="text-sm text-yellow-700 ml-6">
                      • {alert}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Metrics Section */}
        {metrics && (
          <div className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold flex items-center mb-4">
              <Activity className="mr-2 h-5 w-5" />
              System Performance Metrics
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>CPU Usage</span>
                  <span>{metrics.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.cpu}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Memory Usage</span>
                  <span>{metrics.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.memory}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Total API Calls</p>
                <p className="text-xl font-semibold">{metrics.totalCalls}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Average Response Time</p>
                <p className="text-xl font-semibold">{metrics.avgResponseTime}ms</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIServiceDashboard;