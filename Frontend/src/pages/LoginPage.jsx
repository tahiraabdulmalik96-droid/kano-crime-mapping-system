import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.full_name}! 👋`);
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        setError(data.message || 'Login failed!');
        toast.error(data.message || 'Login failed!');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running!');
      toast.error('Cannot connect to server!');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col">
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-bold text-white cursor-pointer"
        >
          🗺️ Kano Crime Mapping System
        </h1>
        <button
          onClick={() => navigate('/')}
          className="text-blue-200 hover:text-white text-sm"
        >
          ← Back to Home
        </button>
      </nav>

      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🗺️</div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Admin Login
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`rounded-lg px-4 py-3 mb-4 text-sm border ${
              darkMode ? 'bg-red-900 border-red-700 text-red-300' : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              ⚠️ {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Info */}
          <div className={`mt-4 rounded-lg p-3 text-xs text-center border ${
            darkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            This portal is for authorized administrators only.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-blue-200 text-center py-4 text-xs">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}