import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

const ProfileVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    identity: 'pending',
    education: 'pending',
    professional: 'pending'
  });
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (type, file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', type);

      const response = await fetch('/api/profile/verify/document', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setVerificationStatus(prev => ({
        ...prev,
        [type]: data.status
      }));
      setDocuments(prev => ({
        ...prev,
        [type]: data.documentUrl
      }));
      setError(null);
    } catch (err) {
      setError('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationProgress = () => {
    const completed = Object.values(verificationStatus).filter(
      status => status === 'verified'
    ).length;
    return (completed / Object.keys(verificationStatus).length) * 100;
  };

  const renderVerificationSection = (type, title, description) => {
    const status = verificationStatus[type];
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
          {status === 'verified' ? (
            <CheckCircle className="text-green-500 h-6 w-6" />
          ) : status === 'rejected' ? (
            <AlertTriangle className="text-red-500 h-6 w-6" />
          ) : null}
        </div>

        <div className="flex gap-4 items-center">
          <input
            type="file"
            id={`file-${type}`}
            className="hidden"
            onChange={(e) => handleFileUpload(type, e.target.files[0])}
          />
          <button
            onClick={() => document.getElementById(`file-${type}`).click()}
            disabled={loading || status === 'verified'}
            className={`flex items-center px-4 py-2 rounded-md ${
              status === 'verified'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Upload className="mr-2 h-4 w-4" />
            {status === 'verified' ? 'Verified' : 'Upload Document'}
          </button>
          {documents[type] && (
            <span className="text-sm text-gray-500">
              Document uploaded successfully
            </span>
          )}
        </div>

        {status === 'rejected' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            Verification failed. Please upload a valid document.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Profile Verification
          </h2>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Verification Progress</span>
            <span>{Math.round(getVerificationProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${getVerificationProgress()}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6">
          {renderVerificationSection(
            'identity',
            'Identity Verification',
            'Upload a government-issued ID for identity verification'
          )}
          
          {renderVerificationSection(
            'education',
            'Educational Credentials',
            'Upload your degree certificates or transcripts'
          )}
          
          {renderVerificationSection(
            'professional',
            'Professional Experience',
            'Upload work certificates or recommendation letters'
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileVerification;