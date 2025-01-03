// src/pages/university/BatchUpload.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityService from '../../services/universityService';

const BatchUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }
      
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
        setError('Please upload a CSV or Excel file');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await UniversityService.uploadStudentsBatch(formData);
      
      if (response.success) {
        setUploadStatus({
          success: true,
          message: `Successfully uploaded ${response.data} students`,
        });
        setFile(null);
        // Reset file input
        e.target.reset();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload students data');
      setUploadStatus(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Batch Upload Students</h1>
          <p className="text-gray-600">Upload multiple student records using CSV or Excel file</p>
        </div>
        <button
          onClick={() => navigate('/university/students')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back to Students
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">File Requirements</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
              <li>File must be in CSV or Excel format (.csv, .xlsx, .xls)</li>
              <li>Maximum file size: 5MB</li>
              <li>Required columns: Name, Email, Department</li>
              <li>Optional columns: CGPA, Batch Year, Phone Number</li>
              <li>First row should contain column headers</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-50 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-100"
              >
                Choose File
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          {uploadStatus?.success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg">
              {uploadStatus.message}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError(null);
                setUploadStatus(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              disabled={uploading}
            >
              Clear
            </button>
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg ${
                uploading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              }`}
              disabled={uploading || !file}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload File'
              )}
            </button>
          </div>
        </form>

        {uploadStatus?.success && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/university/students')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Updated Student List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchUpload;