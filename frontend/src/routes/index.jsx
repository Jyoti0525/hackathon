import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // We'll create this
import DashboardLayout from '../components/layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentAssessments from '../pages/student/Assessments';
import StudentProfile from '../pages/student/Profile';
import JobSearch from '../pages/student/JobSearch';
import SkillDevelopment from '../pages/student/SkillDevelopment';
import InterviewPrep from '../pages/student/InterviewPrep';

// Company Pages
import CompanyDashboard from '../pages/company/Dashboard';
import CompanyProfile from '../pages/company/Profile';
import CandidateSearch from '../pages/company/CandidateSearch';
import JobManagement from '../pages/company/JobManagement';
import CompanyAnalytics from '../pages/company/Analytics';
import InterviewManagement from '../pages/company/InterviewManagement';

// University Pages
import UniversityDashboard from '../pages/university/Dashboard';
import UniversityProfile from '../pages/university/Profile';
import Students from '../pages/university/Students';
import BatchUpload from '../pages/university/BatchUpload';
import UniversityAnalytics from '../pages/university/Analytics';
import Placements from '../pages/university/Placements';

// Shared Components
import Settings from '../pages/shared/Settings';
import NotFound from '../pages/shared/NotFound';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const defaultPath = `/dashboard/${user.role}`;
    return <Navigate to={defaultPath} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  const DashboardRedirect = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    const roleRoutes = {
      student: '/dashboard/student',
      company: '/dashboard/company',
      university: '/dashboard/university'
    };

    return <Navigate to={roleRoutes[user.role] || '/login'} />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Dashboard Redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Student Routes */}
      <Route path="/dashboard/student" element={
        <ProtectedRoute roles={['student']}>
          <DashboardLayout role="student" />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="assessments" element={<StudentAssessments />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="jobs" element={<JobSearch />} />
        <Route path="skills" element={<SkillDevelopment />} />
        <Route path="interview-prep" element={<InterviewPrep />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Company Routes */}
      <Route path="/dashboard/company" element={
        <ProtectedRoute roles={['company']}>
          <DashboardLayout role="company" />
        </ProtectedRoute>
      }>
        <Route index element={<CompanyDashboard />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="candidates" element={<CandidateSearch />} />
        <Route path="jobs" element={<JobManagement />} />
        <Route path="analytics" element={<CompanyAnalytics />} />
        <Route path="interviews" element={<InterviewManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* University Routes */}
      <Route path="/dashboard/university" element={
        <ProtectedRoute roles={['university']}>
          <DashboardLayout role="university" />
        </ProtectedRoute>
      }>
        <Route index element={<UniversityDashboard />} />
        <Route path="profile" element={<UniversityProfile />} />
        <Route path="students" element={<Students />} />
        <Route path="upload" element={<BatchUpload />} />
        <Route path="analytics" element={<UniversityAnalytics />} />
        <Route path="placements" element={<Placements />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Route */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;