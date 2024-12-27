import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const InterviewPrep = () => {
  const { user } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Sample data - replace with API integration
  const prepTracks = [
    {
      id: 1,
      title: 'Technical Interview Prep',
      description: 'Data Structures, Algorithms, and System Design',
      topics: ['DSA', 'System Design', 'Problem Solving'],
      difficulty: 'Advanced',
      duration: '4 weeks'
    },
    {
      id: 2,
      title: 'Full Stack Development',
      description: 'Web Development concepts and practical scenarios',
      topics: ['Frontend', 'Backend', 'Database', 'API Design'],
      difficulty: 'Intermediate',
      duration: '3 weeks'
    },
    {
      id: 3,
      title: 'Behavioral Interviews',
      description: 'Soft skills and situation handling',
      topics: ['Leadership', 'Team Work', 'Communication'],
      difficulty: 'Beginner',
      duration: '2 weeks'
    }
  ];

  const upcomingMocks = [
    {
      id: 1,
      company: 'Tech Corp',
      role: 'Software Engineer',
      date: '2024-01-20',
      time: '10:00 AM',
      type: 'Technical'
    },
    {
      id: 2,
      company: 'Startup Inc',
      role: 'Full Stack Developer',
      date: '2024-01-22',
      time: '2:00 PM',
      type: 'HR'
    }
  ];

  const practiceQuestions = [
    {
      id: 1,
      question: 'Implement a binary search algorithm',
      difficulty: 'Medium',
      category: 'DSA',
      attempts: 24,
      successRate: '75%'
    },
    {
      id: 2,
      question: 'Design a scalable chat application',
      difficulty: 'Hard',
      category: 'System Design',
      attempts: 15,
      successRate: '60%'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Interview Preparation</h1>
        <p className="text-gray-600">Prepare for your dream job interviews</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Mock Interviews</h3>
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-green-600">2 upcoming</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Practice Questions</h3>
          <p className="text-2xl font-bold">45</p>
          <p className="text-sm text-blue-600">15 completed</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Average Score</h3>
          <p className="text-2xl font-bold">85%</p>
          <p className="text-sm text-green-600">+5% this week</p>
        </div>
      </div>

      {/* Preparation Tracks */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Interview Preparation Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prepTracks.map(track => (
              <div 
                key={track.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTrack?.id === track.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedTrack(track)}
              >
                <h3 className="font-semibold mb-2">{track.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{track.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Difficulty:</span>
                    <span className="font-medium">{track.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">{track.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Mock Interviews */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Mock Interviews</h2>
          <div className="space-y-4">
            {upcomingMocks.map(mock => (
              <div key={mock.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{mock.company}</h3>
                    <p className="text-sm text-gray-600">{mock.role}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {mock.type}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {mock.date} at {mock.time}
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Join Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Questions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Practice Questions</h2>
          <div className="space-y-4">
            {practiceQuestions.map(question => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{question.question}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {question.category}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Start Practice
                  </button>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Attempts: {question.attempts}</span>
                  <span>Success Rate: {question.successRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;