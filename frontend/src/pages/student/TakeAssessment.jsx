// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const TakeAssessment = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { questions } = location.state || { questions: [] };

//     const [assessmentData, setAssessmentData] = useState(() => ({
//         questions: questions.map(q => q.question),
//         answers: Array(questions.length).fill(''),
//         expectedAnswers: questions.map(q => q.expected_answer)
//     }));

//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//     const handleAnswerChange = (value) => {
//         const newAnswers = [...assessmentData.answers];
//         newAnswers[currentQuestionIndex] = value;
//         setAssessmentData(prev => ({
//             ...prev,
//             answers: newAnswers
//         }));
//     };

//     const handleSubmit = () => {
//         // This will be implemented later as mentioned
//         console.log('Assessment Data:', assessmentData);
//     };

//     return (
//         <div className="p-6 max-w-4xl mx-auto">
//             <div className="mb-6 flex justify-between items-center">
//                 <h1 className="text-2xl font-bold">Take Assessment</h1>
//                 <span className="text-gray-600">
//                     Question {currentQuestionIndex + 1} of {questions.length}
//                 </span>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg p-6">
//                 {/* Current Question Display */}
//                 <div className="mb-6">
//                     <div className="flex justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-600">
//                             Skill: {questions[currentQuestionIndex].skill}
//                         </span>
//                         <span className="text-sm font-medium text-gray-600">
//                             Difficulty: {questions[currentQuestionIndex].difficulty}
//                         </span>
//                     </div>
                    
//                     <h2 className="text-lg font-semibold mb-4">
//                         {questions[currentQuestionIndex].question}
//                     </h2>

//                     <div className="space-y-4">
//                         <textarea
//                             value={assessmentData.answers[currentQuestionIndex]}
//                             onChange={(e) => handleAnswerChange(e.target.value)}
//                             className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                             placeholder="Type your answer here..."
//                         />
//                     </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <div className="flex justify-between mt-6">
//                     <button
//                         onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
//                         disabled={currentQuestionIndex === 0}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//                     >
//                         Previous
//                     </button>

//                     {currentQuestionIndex === questions.length - 1 ? (
//                         <button
//                             onClick={handleSubmit}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             Submit Assessment
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             Next Question
//                         </button>
//                     )}
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="mt-6">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                             style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TakeAssessment;



// src/pages/student/TakeAssessment.jsx

// src/pages/student/TakeAssessment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TakeAssessment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions } = location.state || { questions: [] };

    const [assessmentData, setAssessmentData] = useState(() => ({
        questions: questions,
        answers: Array(questions.length).fill('')
    }));

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [evaluationResults, setEvaluationResults] = useState(null);
    const [reportGenerated, setReportGenerated] = useState(false);

    useEffect(() => {
        if (evaluationResults && !reportGenerated) {
            handleReportGeneration();
        }
    }, [evaluationResults]);

    const handleAnswerChange = (value) => {
        const newAnswers = [...assessmentData.answers];
        newAnswers[currentQuestionIndex] = value;
        setAssessmentData(prev => ({
            ...prev,
            answers: newAnswers
        }));
    };

    const handleReportGeneration = async () => {
        try {
            console.log("Generating report from results:", evaluationResults);
            setReportGenerated(true);
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            const answersObject = assessmentData.answers.reduce((obj, answer, index) => {
                obj[index] = answer;
                return obj;
            }, {});

            const response = await fetch('http://localhost:8500/evaluate', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                },
                body: JSON.stringify({
                    questions: assessmentData.questions,
                    answers: answersObject
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to evaluate assessment');
            }

            setEvaluationResults(data);
            
        } catch (error) {
            setError('Failed to submit assessment. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const ResultsDisplay = ({ results }) => {
        if (!results) return null;

        const progressColor = () => {
            const percentage = (results.total_points / results.max_possible) * 100;
            if (percentage >= 80) return 'bg-green-600';
            if (percentage >= 60) return 'bg-yellow-600';
            return 'bg-red-600';
        };

        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Assessment Results</h1>
                    
                    {/* Score Overview */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold">
                                {results.total_points} / {results.max_possible}
                            </span>
                            <span className="text-lg">
                                ({((results.total_points / results.max_possible) * 100).toFixed(1)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className={`${progressColor()} h-2.5 rounded-full transition-all duration-300`}
                                style={{ width: `${(results.total_points / results.max_possible) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Overall Assessment */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Overall Assessment</h2>
                        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                            {results.feedback.overall_assessment}
                        </p>
                    </div>

                    {/* Strengths and Areas to Improve */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-3">Strengths</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {results.feedback.strengths.map((strength, idx) => (
                                    <li key={idx} className="text-green-700">{strength}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-red-800 mb-3">Areas to Improve</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {results.feedback.areas_to_improve.map((area, idx) => (
                                    <li key={idx} className="text-red-700">{area}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Detailed Question Analysis */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
                        {results.evaluations.map((evaluation, index) => (
                            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium">Question {index + 1}</h3>
                                    <span className="px-3 py-1 bg-white rounded-full text-sm">
                                        {evaluation.points_awarded} points
                                    </span>
                                </div>

                                <p className="mb-3 text-gray-700">{evaluation.explanation}</p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="font-medium text-gray-700">Your Answer:</p>
                                        <div className="bg-white p-3 rounded border">
                                            {assessmentData.answers[index] || 'No answer provided'}
                                        </div>
                                    </div>
                                </div>

                                {evaluation.key_points_covered.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-green-700 mb-2">Key Points Covered:</h4>
                                        <ul className="list-disc list-inside pl-4 space-y-1">
                                            {evaluation.key_points_covered.map((point, idx) => (
                                                <li key={idx} className="text-green-600">{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {evaluation.missing_points.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-red-700 mb-2">Missing Points:</h4>
                                        <ul className="list-disc list-inside pl-4 space-y-1">
                                            {evaluation.missing_points.map((point, idx) => (
                                                <li key={idx} className="text-red-600">{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Learning Recommendations */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Learning Recommendations</h2>
                        <div className="space-y-4">
                            {results.feedback.learning_recommendations.map((rec, idx) => (
                                <div key={idx} className="p-4 bg-yellow-50 rounded-lg">
                                    <h3 className="font-medium text-yellow-800 mb-2">{rec.topic}</h3>
                                    <p className="text-yellow-700 mb-3">{rec.reason}</p>
                                    <div className="pl-4">
                                        <h4 className="font-medium mb-2">Recommended Resources:</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {rec.resources.map((resource, resourceIdx) => (
                                                <li key={resourceIdx} className="text-yellow-700">{resource}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next Steps and Encouragement */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                        <ul className="list-decimal list-inside space-y-2">
                            {results.feedback.next_steps.map((step, idx) => (
                                <li key={idx} className="text-gray-700">{step}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold mb-2">Encouragement</h2>
                        <p className="text-blue-700">{results.feedback.encouragement}</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/dashboard/student/assessments')}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                            Return to Assessments
                        </button>
                        {/* <button
                            onClick={handleReportGeneration}
                            disabled={reportGenerated}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {reportGenerated ? 'Report Generated' : 'Generate Report'}
                        </button> */}
                    </div>
                </div>
            </div>
        );
    };

    // Show results if available
    if (evaluationResults) {
        return <ResultsDisplay results={evaluationResults} />;
    }

    // Question taking interface
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Take Assessment</h1>
                <span className="text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Current Question Display */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Skill: {questions[currentQuestionIndex].skill}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                            Difficulty: {questions[currentQuestionIndex].difficulty}
                        </span>
                    </div>
                    
                    <h2 className="text-lg font-semibold mb-4">
                        {questions[currentQuestionIndex].question}
                    </h2>

                    <div className="space-y-4">
                        <textarea
                            value={assessmentData.answers[currentQuestionIndex]}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Type your answer here..."
                        />
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Next Question
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeAssessment;

// src/pages/student/TakeAssessment.jsx

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const TakeAssessment = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
    
//     // Get assessment data with type checking
//     const { type = 'GENERAL', assessment = { questions: [] } } = location.state || {};
    
//     const [assessmentData, setAssessmentData] = useState(() => ({
//         questions: assessment.questions,
//         answers: Array(assessment.questions.length).fill(''),
//         skill: assessment.skill || null,
//         currentLevel: assessment.currentLevel || null,
//         targetLevel: assessment.targetLevel || null
//     }));

//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [evaluationResults, setEvaluationResults] = useState(null);

//     const handleAnswerChange = (value) => {
//         const newAnswers = [...assessmentData.answers];
//         newAnswers[currentQuestionIndex] = value;
//         setAssessmentData(prev => ({
//             ...prev,
//             answers: newAnswers
//         }));
//     };

//     const handleSubmit = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const answersObject = assessmentData.answers.reduce((obj, answer, index) => {
//                 obj[index] = answer;
//                 return obj;
//             }, {});

//             const response = await fetch('http://localhost:8500/evaluate', {
//                 method: 'POST',
//                 mode: 'cors',
//                 credentials: 'include',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Access-Control-Allow-Origin': 'http://localhost:3000'
//                 },
//                 body: JSON.stringify({
//                     questions: assessmentData.questions,
//                     answers: answersObject
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.detail || 'Failed to evaluate assessment');
//             }

//             setEvaluationResults(data);
            
//         } catch (error) {
//             setError('Failed to submit assessment. Please try again.');
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpgradeSkill = async () => {
//         // This will be implemented when needed
//         console.log('Skill upgrade function will be implemented');
//     };

//     // Continuing the TakeAssessment component...

//     const renderResultActions = () => {
//         if (!evaluationResults) return null;

//         const passThreshold = 0.7; // 70% passing threshold
//         const score = evaluationResults.total_points / evaluationResults.max_possible;

//         if (type === 'SKILL_UPGRADE') {
//             return (
//                 <div className="flex gap-4 mt-6">
//                     {score >= passThreshold ? (
//                         <button
//                             onClick={handleUpgradeSkill}
//                             className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
//                         >
//                             Upgrade Skill
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => navigate('/student/skills')}
//                             className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                         >
//                             Return to Skills
//                         </button>
//                     )}
//                 </div>
//             );
//         }

//         // For general assessments
//         return (
//             <button
//                 onClick={() => navigate('/student/assessments')}
//                 className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//             >
//                 Return to Assessments
//             </button>
//         );
//     };

//     // Results display component
//     if (evaluationResults) {
//         return (
//             <div className="p-6 max-w-4xl mx-auto">
//                 <div className="bg-white rounded-lg shadow-lg p-6">
//                     {/* Header Section */}
//                     {type === 'SKILL_UPGRADE' && (
//                         <div className="mb-6">
//                             <h1 className="text-2xl font-bold">Skill Upgrade Results</h1>
//                             <div className="mt-2 text-gray-600">
//                                 <p>Skill: {assessmentData.skill}</p>
//                                 <p>Current Level: {assessmentData.currentLevel}</p>
//                                 <p>Target Level: {assessmentData.targetLevel}</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Score Overview */}
//                     <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//                         <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
//                         <div className="flex items-center justify-between mb-2">
//                             <span className="text-2xl font-bold">
//                                 {evaluationResults.total_points} / {evaluationResults.max_possible}
//                             </span>
//                             <span className="text-lg">
//                                 ({((evaluationResults.total_points / evaluationResults.max_possible) * 100).toFixed(1)}%)
//                             </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div 
//                                 className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                                 style={{ width: `${(evaluationResults.total_points / evaluationResults.max_possible) * 100}%` }}
//                             />
//                         </div>
//                     </div>

//                     {/* Overall Assessment */}
//                     <div className="mb-8">
//                         <h2 className="text-xl font-semibold mb-4">Overall Assessment</h2>
//                         <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
//                             {evaluationResults.feedback.overall_assessment}
//                         </p>
//                     </div>

//                     {/* Strengths and Areas to Improve */}
//                     <div className="grid md:grid-cols-2 gap-6 mb-8">
//                         <div className="bg-green-50 p-4 rounded-lg">
//                             <h3 className="font-semibold text-green-800 mb-3">Strengths</h3>
//                             <ul className="list-disc list-inside space-y-2">
//                                 {evaluationResults.feedback.strengths.map((strength, idx) => (
//                                     <li key={idx} className="text-green-700">{strength}</li>
//                                 ))}
//                             </ul>
//                         </div>
                        
//                         <div className="bg-red-50 p-4 rounded-lg">
//                             <h3 className="font-semibold text-red-800 mb-3">Areas to Improve</h3>
//                             <ul className="list-disc list-inside space-y-2">
//                                 {evaluationResults.feedback.areas_to_improve.map((area, idx) => (
//                                     <li key={idx} className="text-red-700">{area}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>

//                     {/* Question-wise Analysis */}
//                     <div className="mb-8">
//                         <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
//                         {evaluationResults.evaluations.map((evaluation, index) => (
//                             <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
//                                 <div className="flex justify-between items-center mb-3">
//                                     <h3 className="font-medium">Question {index + 1}</h3>
//                                     <span className="px-3 py-1 bg-white rounded-full text-sm">
//                                         {evaluation.points_awarded} points awarded
//                                     </span>
//                                 </div>

//                                 <div className="mb-4">
//                                     <p className="font-medium mb-2">Your Answer:</p>
//                                     <div className="bg-white p-3 rounded border">
//                                         {assessmentData.answers[index] || 'No answer provided'}
//                                     </div>
//                                 </div>

//                                 <p className="mb-3 text-gray-700">{evaluation.explanation}</p>

//                                 {evaluation.key_points_covered.length > 0 && (
//                                     <div className="mb-3">
//                                         <h4 className="font-medium text-green-700 mb-2">Key Points Covered:</h4>
//                                         <ul className="list-disc list-inside pl-4 space-y-1">
//                                             {evaluation.key_points_covered.map((point, idx) => (
//                                                 <li key={idx} className="text-green-600">{point}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}

//                                 {evaluation.missing_points.length > 0 && (
//                                     <div>
//                                         <h4 className="font-medium text-red-700 mb-2">Missing Points:</h4>
//                                         <ul className="list-disc list-inside pl-4 space-y-1">
//                                             {evaluation.missing_points.map((point, idx) => (
//                                                 <li key={idx} className="text-red-600">{point}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* Final Actions */}
//                     {renderResultActions()}
//                 </div>
//             </div>
//         );
//     }

//     // Assessment Taking Interface
//     return (
//         <div className="p-6 max-w-4xl mx-auto">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold">
//                     {type === 'SKILL_UPGRADE' 
//                         ? `${assessmentData.skill} Assessment for ${assessmentData.targetLevel} Level` 
//                         : 'Take Assessment'}
//                 </h1>
//                 {type === 'SKILL_UPGRADE' && (
//                     <p className="text-gray-600 mt-2">
//                         Current Level: {assessmentData.currentLevel} → Target Level: {assessmentData.targetLevel}
//                     </p>
//                 )}
//             </div>

//             {error && (
//                 <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
//                     {error}
//                 </div>
//             )}

//             <div className="bg-white rounded-lg shadow-lg p-6">
//                 {/* Current Question Display */}
//                 <div className="mb-6">
//                     <div className="flex justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-600">
//                             Question {currentQuestionIndex + 1} of {assessmentData.questions.length}
//                         </span>
//                         {assessmentData.questions[currentQuestionIndex]?.skill && (
//                             <span className="text-sm font-medium text-gray-600">
//                                 Skill: {assessmentData.questions[currentQuestionIndex].skill}
//                             </span>
//                         )}
//                     </div>
                    
//                     <h2 className="text-lg font-semibold mb-4">
//                         {assessmentData.questions[currentQuestionIndex]?.question}
//                     </h2>

//                     <div className="space-y-4">
//                         <textarea
//                             value={assessmentData.answers[currentQuestionIndex]}
//                             onChange={(e) => handleAnswerChange(e.target.value)}
//                             className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                             placeholder="Type your answer here..."
//                         />
//                     </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <div className="flex justify-between mt-6">
//                     <button
//                         onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
//                         disabled={currentQuestionIndex === 0}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//                     >
//                         Previous
//                     </button>

//                     {currentQuestionIndex === assessmentData.questions.length - 1 ? (
//                         <button
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                         >
//                             {loading ? 'Submitting...' : 'Submit Assessment'}
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => setCurrentQuestionIndex(prev => Math.min(assessmentData.questions.length - 1, prev + 1))}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             Next Question
//                         </button>
//                     )}
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="mt-6">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                             style={{ width: `${((currentQuestionIndex + 1) / assessmentData.questions.length) * 100}%` }}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TakeAssessment;

// src/pages/student/TakeAssessment.jsx
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const TakeAssessment = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
    
//     // Safely handle state with defaults
//     const { mode = 'GENERAL', assessmentData = { questions: [] } } = location.state || {};
//     const questions = assessmentData.questions || [];
//     const skillInfo = assessmentData.skillInfo || null;

//     const [assessmentState, setAssessmentState] = useState({
//         answers: Array(questions.length).fill(''),
//         currentIndex: 0,
//         loading: false,
//         error: null,
//         results: null
//     });

//     const handleAnswerChange = (value) => {
//         const newAnswers = [...assessmentState.answers];
//         newAnswers[assessmentState.currentIndex] = value;
//         setAssessmentState(prev => ({
//             ...prev,
//             answers: newAnswers
//         }));
//     };

//     const handleSubmit = async () => {
//         try {
//             setAssessmentState(prev => ({ ...prev, loading: true, error: null }));

//             const answersObject = assessmentState.answers.reduce((obj, answer, index) => {
//                 obj[index] = answer;
//                 return obj;
//             }, {});

//             const response = await fetch('http://localhost:8500/evaluate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     questions: questions,
//                     answers: answersObject
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.detail || 'Failed to evaluate assessment');
//             }

//             setAssessmentState(prev => ({ ...prev, results: data }));
            
//         } catch (error) {
//             setAssessmentState(prev => ({
//                 ...prev,
//                 error: 'Failed to submit assessment. Please try again.'
//             }));
//             console.error('Error:', error);
//         } finally {
//             setAssessmentState(prev => ({ ...prev, loading: false }));
//         }
//     };

//     const handleSkillUpgrade = async () => {
//         try {
//             // Add your skill upgrade API call here if needed
//             navigate('/dashboard/student/skills');
//         } catch (error) {
//             console.error('Error upgrading skill:', error);
//             setAssessmentState(prev => ({
//                 ...prev,
//                 error: 'Failed to upgrade skill. Please try again.'
//             }));
//         }
//     };

//     // Results display
//     if (assessmentState.results) {
//         const score = (assessmentState.results.total_points / assessmentState.results.max_possible) * 100;
//         const passThreshold = 70;

//         return (
//             <div className="p-6 max-w-4xl mx-auto">
//                 <div className="bg-white rounded-lg shadow-lg p-6">
//                     {mode === 'SKILL_UPGRADE' && skillInfo && (
//                         <div className="mb-6">
//                             <h1 className="text-2xl font-bold">Skill Assessment Results</h1>
//                             <div className="mt-2 text-gray-600">
//                                 <p>Skill: {skillInfo.name}</p>
//                                 <p>Current Level: {skillInfo.currentLevel}</p>
//                                 <p>Target Level: {skillInfo.targetLevel}</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Score Overview */}
//                     <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//                         <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
//                         <div className="flex items-center justify-between mb-2">
//                             <span className="text-2xl font-bold">
//                                 {assessmentState.results.total_points} / {assessmentState.results.max_possible}
//                             </span>
//                             <span className="text-lg">
//                                 ({score.toFixed(1)}%)
//                             </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div 
//                                 className={`${
//                                     score >= 80 ? 'bg-green-600' : 
//                                     score >= 60 ? 'bg-yellow-600' : 
//                                     'bg-red-600'
//                                 } h-2.5 rounded-full transition-all duration-300`}
//                                 style={{ width: `${score}%` }}
//                             />
//                         </div>
//                     </div>

//                     {/* Overall Assessment */}
//                     <div className="mb-8">
//                         <h2 className="text-xl font-semibold mb-4">Overall Assessment</h2>
//                         <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
//                             {assessmentState.results.feedback.overall_assessment}
//                         </p>
//                     </div>

//                     {/* Strengths and Areas to Improve */}
//                     <div className="grid md:grid-cols-2 gap-6 mb-8">
//                         <div className="bg-green-50 p-4 rounded-lg">
//                             <h3 className="font-semibold text-green-800 mb-3">Strengths</h3>
//                             <ul className="list-disc list-inside space-y-2">
//                                 {assessmentState.results.feedback.strengths.map((strength, idx) => (
//                                     <li key={idx} className="text-green-700">{strength}</li>
//                                 ))}
//                             </ul>
//                         </div>
                        
//                         <div className="bg-red-50 p-4 rounded-lg">
//                             <h3 className="font-semibold text-red-800 mb-3">Areas to Improve</h3>
//                             <ul className="list-disc list-inside space-y-2">
//                                 {assessmentState.results.feedback.areas_to_improve.map((area, idx) => (
//                                     <li key={idx} className="text-red-700">{area}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>

//                     {/* Question Analysis */}
//                     <div className="mb-8">
//                         <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
//                         {assessmentState.results.evaluations.map((evaluation, index) => (
//                             <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
//                                 <div className="flex justify-between items-center mb-3">
//                                     <h3 className="font-medium">Question {index + 1}</h3>
//                                     <span className="px-3 py-1 bg-white rounded-full text-sm">
//                                         {evaluation.points_awarded} points
//                                     </span>
//                                 </div>

//                                 <div className="mb-4">
//                                     <p className="font-medium mb-2">Your Answer:</p>
//                                     <div className="bg-white p-3 rounded border">
//                                         {assessmentState.answers[index] || 'No answer provided'}
//                                     </div>
//                                 </div>

//                                 <p className="mb-3 text-gray-700">{evaluation.explanation}</p>

//                                 {evaluation.key_points_covered.length > 0 && (
//                                     <div className="mt-4">
//                                         <h4 className="font-medium text-green-700 mb-2">Key Points Covered:</h4>
//                                         <ul className="list-disc list-inside pl-4 space-y-1">
//                                             {evaluation.key_points_covered.map((point, idx) => (
//                                                 <li key={idx} className="text-green-600">{point}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}

//                                 {evaluation.missing_points.length > 0 && (
//                                     <div className="mt-4">
//                                         <h4 className="font-medium text-red-700 mb-2">Missing Points:</h4>
//                                         <ul className="list-disc list-inside pl-4 space-y-1">
//                                             {evaluation.missing_points.map((point, idx) => (
//                                                 <li key={idx} className="text-red-600">{point}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* Learning Recommendations */}
//                     <div className="mb-8">
//                         <h2 className="text-xl font-semibold mb-4">Learning Recommendations</h2>
//                         <div className="space-y-4">
//                             {assessmentState.results.feedback.learning_recommendations.map((rec, idx) => (
//                                 <div key={idx} className="p-4 bg-yellow-50 rounded-lg">
//                                     <h3 className="font-medium text-yellow-800 mb-2">{rec.topic}</h3>
//                                     <p className="text-yellow-700 mb-3">{rec.reason}</p>
//                                     <div className="pl-4">
//                                         <h4 className="font-medium mb-2">Recommended Resources:</h4>
//                                         <ul className="list-disc list-inside space-y-1">
//                                             {rec.resources.map((resource, resourceIdx) => (
//                                                 <li key={resourceIdx} className="text-yellow-700">{resource}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Final Actions */}
//                     <div className="mt-6">
//                         {mode === 'SKILL_UPGRADE' ? (
//                             score >= passThreshold ? (
//                                 <button
//                                     onClick={handleSkillUpgrade}
//                                     className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
//                                 >
//                                     Confirm Skill Upgrade
//                                 </button>
//                             ) : (
//                                 <button
//                                     onClick={() => navigate('/dashboard/student/skills')}
//                                     className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                                 >
//                                     Return to Skills
//                                 </button>
//                             )
//                         ) : (
//                             <button
//                                 onClick={() => navigate('/dashboard/student/assessments')}
//                                 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                             >
//                                 Return to Assessments
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // Assessment Taking Interface
//     return (
//         <div className="p-6 max-w-4xl mx-auto">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold">
//                     {mode === 'SKILL_UPGRADE' && skillInfo 
//                         ? `${skillInfo.name} Assessment (${skillInfo.targetLevel} Level)`
//                         : 'Take Assessment'}
//                 </h1>
//                 {mode === 'SKILL_UPGRADE' && skillInfo && (
//                     <p className="text-gray-600 mt-2">
//                         Upgrading from {skillInfo.currentLevel} to {skillInfo.targetLevel}
//                     </p>
//                 )}
//             </div>

//             {assessmentState.error && (
//                 <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
//                     {assessmentState.error}
//                 </div>
//             )}

//             <div className="bg-white rounded-lg shadow-lg p-6">
//                 {/* Question Display */}
//                 <div className="mb-6">
//                     <div className="flex justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-600">
//                             Question {assessmentState.currentIndex + 1} of {questions.length}
//                         </span>
//                         {questions[assessmentState.currentIndex]?.skill && (
//                             <span className="text-sm font-medium text-gray-600">
//                                 Skill: {questions[assessmentState.currentIndex].skill}
//                             </span>
//                         )}
//                     </div>
                    
//                     <h2 className="text-lg font-semibold mb-4">
//                         {questions[assessmentState.currentIndex]?.question}
//                     </h2>

//                     <div className="space-y-4">
//                         <textarea
//                             value={assessmentState.answers[assessmentState.currentIndex]}
//                             onChange={(e) => handleAnswerChange(e.target.value)}
//                             className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                             placeholder="Type your answer here..."
//                         />
//                     </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <div className="flex justify-between mt-6">
//                     <button
//                         onClick={() => setAssessmentState(prev => ({
//                             ...prev,
//                             currentIndex: Math.max(0, prev.currentIndex - 1)
//                         }))}
//                         disabled={assessmentState.currentIndex === 0}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//                     >
//                         Previous
//                     </button>

//                     {assessmentState.currentIndex === questions.length - 1 ? (
//                         <button
//                             onClick={handleSubmit}
//                             disabled={assessmentState.loading}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                         >
//                             {assessmentState.loading ? 'Submitting...' : 'Submit Assessment'}
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => setAssessmentState(prev => ({
//                                 ...prev,
//                                 currentIndex: Math.min(questions.length - 1, prev.currentIndex + 1)
//                             }))}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             Next Question
//                         </button>
//                     )}
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="mt-6">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                             style={{ width: `${((assessmentState.currentIndex + 1) / questions.length) * 100}%` }}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TakeAssessment;