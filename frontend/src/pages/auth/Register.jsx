import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../utils/api';
import { Typography } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Register the user
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.success) {
        // Automatically log in the user after registration
        const loginResult = await login({
          email: formData.email,
          password: formData.password,
        });

        if (loginResult.success) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg flex">
        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-t from-[#2C4C24] via-[#356E3C] to-[#4C8B56] text-white p-8 rounded-l-lg flex flex-col items-center justify-center">
          <Typography
            variant="h1"
            component="div"
            sx={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontFamily: 'Arial',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              animation: 'pulse 2s infinite',
            }}
          >
            <span
              style={{
                backgroundColor: '#FFFFFF',
                color: '#356E3C',
                padding: '0.2rem 0.5rem',
                borderRadius: '5px',
              }}
            >
              T
            </span>
            B
          </Typography>
          <p className="text-lg text-center font-medium">
            Welcome to the TB platform. <br /> Your journey starts here!
          </p>
          
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
            Create Account
          </h2>
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="university">University</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 bg-[#2D9152] text-white font-bold rounded-lg transition-all duration-300 transform ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;