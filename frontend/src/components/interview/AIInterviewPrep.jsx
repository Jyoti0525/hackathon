import React, { useState, useEffect } from 'react';
import { Video, Mic, PlayCircle, PauseCircle, MessageSquare } from 'lucide-react';

const AIInterviewPrep = () => {
  const [sessionType, setSessionType] = useState('mock');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const startSession = async (type) => {
    try {
      setLoading(true);
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await response.json();
      setCurrentQuestion(data.question);
      setSessionType(type);
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/interview/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: userResponse,
          questionId: currentQuestion.id,
        }),
      });
      const data = await response.json();
      setFeedback(data);
      setSessionHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          response: userResponse,
          feedback: data,
        },
      ]);
    } catch (error) {
      console.error('Failed to analyze response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        {/* Session Control Panel */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-2xl font-bold mb-4">AI Interview Preparation</h2>
          <div className="flex gap-4">
            <button
              onClick={() => startSession('mock')}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Video className="mr-2 h-4 w-4" />
              Start Mock Interview
            </button>
            <button
              onClick={() => startSession('practice')}
              disabled={loading}
              className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Practice Questions
            </button>
          </div>
        </div>

        {/* Current Question and Response */}
        {currentQuestion && (
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold mb-4">Current Question</h3>
            <div className="p-4 bg-gray-50 rounded mb-4">
              <p className="text-lg">{currentQuestion.text}</p>
              {currentQuestion.context && (
                <p className="text-sm text-gray-600 mt-2">
                  Context: {currentQuestion.context}
                </p>
              )}
            </div>
            <div className="flex gap-4 items-center mb-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center px-4 py-2 border rounded ${
                  isRecording ? 'bg-red-50 border-red-500' : 'border-gray-300'
                }`}
              >
                {isRecording ? (
                  <PauseCircle className="mr-2 h-4 w-4" />
                ) : (
                  <Mic className="mr-2 h-4 w-4" />
                )}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              <span className="text-sm text-gray-500">
                {isRecording && 'Recording in progress...'}
              </span>
            </div>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type or speak your response..."
              className="w-full p-2 border border-gray-300 rounded min-h-[150px] focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={submitResponse}
              disabled={loading || !userResponse}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Submit Response
            </button>
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold mb-4">AI Feedback</h3>
            <div className="grid gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Content Analysis</h4>
                <p className="text-gray-700">{feedback.contentFeedback}</p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Delivery Suggestions</h4>
                <ul className="list-disc list-inside">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 mb-1">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Score Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(feedback.scores).map(([category, score]) => (
                    <div key={category}>
                      <p className="text-sm text-gray-600">{category}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold mb-4">Session History</h3>
            <div className="grid gap-4">
              {sessionHistory.map((item, index) => (
                <div key={index} className="p-4 border rounded">
                  <p className="font-medium">{item.question.text}</p>
                  <p className="text-gray-600 mt-2">{item.response}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Score: {item.feedback.overallScore}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInterviewPrep;
