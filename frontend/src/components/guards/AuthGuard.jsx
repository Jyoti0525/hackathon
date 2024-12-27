import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Route guards based on user role
  const path = location.pathname;
  if (
    (path.startsWith('/dashboard/student') && user.role !== 'student') ||
    (path.startsWith('/dashboard/company') && user.role !== 'company') ||
    (path.startsWith('/dashboard/university') && user.role !== 'university')
  ) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
};

export default AuthGuard;