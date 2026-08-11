import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className="bg-blue-700 px-6 py-4 flex justify-between items-center shadow-md">
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-bold text-white cursor-pointer"
        >
          🗺️ Kano Crime Mapping System
        </h1>
      </nav>

      {/* 404 Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <div className="text-6xl mb-6">🗺️</div>
        <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Page Not Found
        </h2>
        <p className={`mb-8 max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Oops! The page you are looking for does not exist.
          It may have been moved or the URL might be incorrect.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: '🏠 Home', path: '/' },
            { label: '🗺️ Crime Map', path: '/map' },
            { label: '📊 Dashboard', path: '/dashboard' },
            { label: '📋 Report Crime', path: '/report' },
          ].map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold border shadow-sm transition ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-blue-500 hover:text-blue-400'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition"
        >
          ← Back to Home
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4 text-sm">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}