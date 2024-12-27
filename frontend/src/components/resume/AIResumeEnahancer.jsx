import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload, CheckCircle, AlertTriangle } from 'lucide-react';

const AIResumeEnhancer = () => {
  const [resumeContent, setResumeContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeResume = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: resumeContent })
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const enhanceResume = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resume/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: resumeContent })
      });
      const data = await response.json();
      setResumeContent(data.enhancedContent);
    } catch (err) {
      setError('Failed to enhance resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-2xl font-bold">AI Resume Enhancer</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileUpload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
                <Button 
                  onClick={analyzeResume} 
                  disabled={loading || !resumeContent}
                >
                  Analyze Resume
                </Button>
                <Button 
                  onClick={enhanceResume}
                  disabled={loading || !resumeContent}
                >
                  Enhance Resume
                </Button>
              </div>
              
              <Textarea 
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                placeholder="Paste your resume content here..."
                className="min-h-[300px]"
              />
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card className="w-full">
            <CardHeader>
              <h3 className="text-xl font-semibold">Resume Analysis</h3>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* Skill Match Section */}
                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Skill Match Analysis</h4>
                  {analysis.skillMatches.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {skill.match > 70 ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <AlertTriangle className="text-yellow-500 h-5 w-5" />
                      )}
                      <span>{skill.name}: {skill.match}% match</span>
                    </div>
                  ))}
                </div>

                {/* Improvement Suggestions */}
                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Suggested Improvements</h4>
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="mb-2 text-gray-700">
                      • {suggestion}
                    </div>
                  ))}
                </div>

                {/* ATS Compatibility */}
                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">ATS Compatibility Score</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${analysis.atsScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analysis.atsScore}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AIResumeEnhancer;