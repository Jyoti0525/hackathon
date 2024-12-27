import React, { useState } from 'react';
// In pages/company/InterviewManagement.jsx
import AIInterviewPrep from '../../components/interview/AIInterviewPrep';

const InterviewManagement = () => {
  // Example interviews data
  const [interviews, setInterviews] = useState([
    { id: 1, candidate: 'John Doe', position: 'Software Engineer', date: '2024-12-28', status: 'Scheduled' },
    { id: 2, candidate: 'Jane Smith', position: 'Data Analyst', date: '2024-12-29', status: 'Pending' },
    { id: 3, candidate: 'Samuel Green', position: 'Project Manager', date: '2024-12-30', status: 'Completed' },
  ]);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Interview Management</h1>
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Candidate</th>
            <th className="px-4 py-2">Position</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview) => (
            <tr key={interview.id} className="border-b">
              <td className="px-4 py-2">{interview.candidate}</td>
              <td className="px-4 py-2">{interview.position}</td>
              <td className="px-4 py-2">{interview.date}</td>
              <td className="px-4 py-2">{interview.status}</td>
              <td className="px-4 py-2">
                <button className="text-blue-500 mr-2">Reschedule</button>
                <button className="text-red-500">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewManagement;
