import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/ui/DarkModeToggle';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/alerts');
        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Navbar */}
      <nav className="bg-blue-700 px-6 py-4 flex justify-between items-center shadow-md flex-wrap gap-2">
        <h1 className="text-xl font-bold text-white">
          🗺️ Kano Crime Mapping System
        </h1>
        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={() => navigate('/map')}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
          >
            Crime Map
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/police-stats')}
            className="text-white border border-blue-400 px-3 py-2 rounded-lg hover:bg-blue-600 font-medium text-sm"
          >
            Police Stats
          </button>
          <button
            onClick={() => navigate('/about')}
            className="text-white border border-blue-400 px-3 py-2 rounded-lg hover:bg-blue-600 font-medium text-sm"
          >
            About
          </button>
          <button
            onClick={() => navigate('/report')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-400"
          >
            Report Crime
          </button>
          {user ? (
            <button
              onClick={() => navigate('/admin')}
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
            >
              ⚙️ Admin Panel
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
            >
              Admin Login
            </button>
          )}
          <DarkModeToggle />
        </div>
      </nav>

      {/* Safety Alerts Banner */}
      {alerts.length > 0 && (
        <div className={`border-b px-6 py-3 ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'}`}>
          <div className="max-w-4xl mx-auto">
            <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
              🚨 Active Safety Alerts:
            </p>
            <div className="flex flex-col gap-2">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`px-4 py-2 rounded-lg text-sm flex items-start gap-2 ${
                    alert.severity === 'danger'
                      ? darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
                      : alert.severity === 'warning'
                      ? darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                      : darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span>
                    {alert.severity === 'danger' ? '🚨' :
                     alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                  </span>
                  <div>
                    <strong>{alert.title}</strong> — {alert.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-blue-700 text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Kano Crime Mapping &
          <span className="text-yellow-300"> Safety Analysis System</span>
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          A web-based platform for visualizing and analyzing crime patterns
          across the 7 LGAs of Kano City to enhance public safety awareness.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/map')}
            className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg text-lg font-bold hover:bg-yellow-300"
          >
            🗺️ View Crime Map
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-blue-700 px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-50"
          >
            📊 View Dashboard
          </button>
          <button
            onClick={() => navigate('/report')}
            className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-red-400"
          >
            📋 Report a Crime
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-12 px-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className={`text-center text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Kano City — At a Glance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className={`rounded-xl shadow p-6 text-center border-t-4 border-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="text-4xl font-bold text-blue-500">7</div>
            <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>LGAs Covered</div>
          </div>
          <div className={`rounded-xl shadow p-6 text-center border-t-4 border-red-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="text-4xl font-bold text-red-500">24</div>
            <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Crimes Recorded</div>
          </div>
          <div className={`rounded-xl shadow p-6 text-center border-t-4 border-yellow-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="text-4xl font-bold text-yellow-500">2</div>
            <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>High Risk Areas</div>
          </div>
          <div className={`rounded-xl shadow p-6 text-center border-t-4 border-green-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="text-4xl font-bold text-green-500">5</div>
            <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Crime Types</div>
          </div>
        </div>
      </div>

      {/* LGA Cards */}
      <div className={`py-12 px-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <h3 className={`text-center text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Monitored LGAs — Kano City
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {['Dala', 'Fagge', 'Gwale', 'Kano Municipal',
            'Nassarawa', 'Tarauni', 'Ungogo'].map(lga => (
            <div
              key={lga}
              onClick={() => navigate('/map')}
              className={`border rounded-xl p-4 text-center cursor-pointer transition ${
                darkMode
                  ? 'bg-gray-800 border-blue-700 hover:bg-gray-700 text-blue-300'
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800'
              }`}
            >
              <div className="text-2xl mb-2">📍</div>
              <div className="font-semibold">{lga}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={`py-12 px-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className={`text-center text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '📋', title: 'Report a Crime', desc: 'Submit crime incidents happening in your area with location and details.' },
            { icon: '🗺️', title: 'View on Map', desc: 'See all reported crimes plotted on an interactive map of Kano City.' },
            { icon: '📊', title: 'Analyze Patterns', desc: 'Track weekly crime trends and identify high risk areas across all 7 LGAs.' },
          ].map(item => (
            <div
              key={item.title}
              className={`rounded-xl shadow p-6 text-center ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {item.title}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4 text-sm">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}