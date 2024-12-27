// frontend/src/components/drives/DriveManagement.jsx
import React, { useState, useEffect } from 'react';
import UniversityService from '../../services/universityService';

const DriveManagement = ({ driveId, onClose }) => {
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchDriveDetails();
  }, [driveId]);

  const fetchDriveDetails = async () => {
    try {
      setLoading(true);
      const response = await UniversityService.getDriveDetails(driveId);
      setDrive(response.data);
    } catch (err) {
      setError('Failed to fetch drive details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await UniversityService.updateDriveStatus(driveId, newStatus);
      fetchDriveDetails();
    } catch (err) {
      console.error('Error updating drive status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{drive?.company?.name}</h2>
              <p className="text-gray-600">Drive Date: {new Date(drive?.driveDate).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 px-1 ${activeTab === 'details' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500'}`}
              >
                Drive Details
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`pb-2 px-1 ${activeTab === 'students' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500'}`}
              >
                Registered Students
              </button>
              <button
                onClick={() => setActiveTab('rounds')}
                className={`pb-2 px-1 ${activeTab === 'rounds' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500'}`}
              >
                Interview Rounds
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          <div className="space-y-6">
            {activeTab === 'details' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Drive Status</h3>
                    <select
                      value={drive?.status}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Registration Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Registration</h3>
                    <p>Total Registrations: {drive?.registeredStudents?.length || 0}</p>
                    <p>Deadline: {new Date(drive?.registrationDeadline).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Job Roles */}
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Job Roles</h3>
                  <div className="space-y-4">
                    {drive?.jobRoles?.map((role, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{role.title}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {role.package} LPA
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">Positions: {role.numberOfPositions}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {role.requiredSkills?.map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Eligibility Criteria</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Minimum CGPA</p>
                        <p className="font-medium">{drive?.eligibilityCriteria?.minimumCGPA}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Allowed Backlogs</p>
                        <p className="font-medium">{drive?.eligibilityCriteria?.allowedBacklogs}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Eligible Branches</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {drive?.eligibilityCriteria?.eligibleBranches?.map((branch, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                            {branch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drive?.registeredStudents?.map((registration, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{registration.student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(registration.registrationDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Update Status</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'rounds' && (
              <div className="space-y-4">
                {drive?.rounds?.map((round, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Round {round.roundNumber}: {round.roundType}</h4>
                        <p className="text-sm text-gray-600">
                          Date: {new Date(round.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        round.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        round.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {round.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveManagement;