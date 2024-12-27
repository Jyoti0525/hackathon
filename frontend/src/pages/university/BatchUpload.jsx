// frontend/src/components/upload/BatchUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const BatchUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('students');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      console.log('Starting upload to:', `/api/upload/${uploadType}`); // Debug log
      const response = await axios.post(
        `/api/university/upload/${uploadType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('Upload response:', response); // Debug log
      setMessage(response.data.message);
    } catch (error) {
      console.error('Upload error:', error); // Debug log
      setMessage(error.response?.data?.message || `Upload failed: ${error.message}`);
    }
    setLoading(false);
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Batch Data Upload</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Data Type
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
          >
            <option value="students">Students</option>
            <option value="companies">Companies</option>
            <option value="placements">Placements</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="mt-1 block w-full"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchUpload;