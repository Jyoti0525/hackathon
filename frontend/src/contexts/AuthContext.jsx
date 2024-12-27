import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get('/auth/verify');
            if (response.success) {
                setUser(response.user);
                setError(null); // Clear any existing errors
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            setUser(null);
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
      try {
          setLoading(true);
          setError(null);
          
          const response = await api.post('/auth/login', credentials);
          
          if (response && response.token) { // Check for token instead of success flag
              localStorage.setItem('token', response.token);
              setUser(response.user);
              return { success: true, user: response.user };
          } else {
              throw new Error('Invalid response from server');
          }
      } catch (err) {
          setError(err.message);
          return { success: false, error: err.message };
      } finally {
          setLoading(false);
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/auth/register', userData);
            
            if (response.success) {
                return { success: true };
            }

            const errorMessage = response.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err.message || 'An error occurred during registration';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        register,
        clearError,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;