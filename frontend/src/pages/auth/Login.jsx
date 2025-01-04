import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { Typography } from '@mui/material';


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false); // Track CAPTCHA state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleCaptcha = (value) => {
    if (value) {
      setCaptchaVerified(true); // reCAPTCHA is completed
      setError(''); // Clear any previous CAPTCHA errors
    } else {
      setCaptchaVerified(false); // reCAPTCHA is not completed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA'); // Show error if CAPTCHA is not clicked
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success && result.user) {
        const role = result.user.role;
        switch (role) {
          case 'university':
            navigate('/dashboard/university', { replace: true });
            break;
          case 'student':
            navigate('/dashboard/student', { replace: true });
            break;
          case 'company':
            navigate('/dashboard/company', { replace: true });
            break;
          default:
            navigate('/dashboard', { replace: true });
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg flex">
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
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Sign in to your account</h2>
          <p className="text-sm text-gray-600 mb-4">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <ReCAPTCHA
              sitekey="6LcqR60qAAAAADFOFBJTDI44wR0pCDSk7wFEf2bO" // Replace with your Site Key
              onChange={handleCaptcha}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 bg-[#2D9152] text-white font-bold rounded-lg transition-all duration-300 transform ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;