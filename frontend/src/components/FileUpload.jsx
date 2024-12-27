// src/components/FileUpload.jsx
import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  CircularProgress, 
  Alert,
  Typography 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onUploadSuccess, acceptedFiles = '.csv' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Add your file upload logic here
      setSuccess('File uploaded successfully!');
      if (onUploadSuccess) {
        onUploadSuccess({ fileName: file.name });
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <input
        accept={acceptedFiles}
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          Upload File
        </Button>
      </label>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
          <Typography>Uploading...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;