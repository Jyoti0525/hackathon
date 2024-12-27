// src/pages/university/StudentUpload.jsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import FileUpload from '../../components/FileUpload';

const StudentUpload = () => {
  const handleUploadSuccess = (data) => {
    console.log('Upload successful:', data);
  };

  return (
    <DashboardLayout title="Upload Students">
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Student Data
          </Typography>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            acceptedFiles=".csv"
          />
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default StudentUpload;