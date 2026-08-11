import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AboutPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const cardClass = `rounded-xl shadow p-8 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`;
  const headingClass = `text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`;
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className="bg-blue-700 px-6 py-4 flex justify-between items-center shadow-md">
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-bold text-white cursor-pointer"
        >
          🗺️ Kano Crime Mapping System
        </h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="text-white hover:text-yellow-300 font-medium">Home</button>
          <button onClick={() => navigate('/map')} className="text-white hover:text-yellow-300 font-medium">Map</button>
          <button onClick={() => navigate('/dashboard')} className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Dashboard</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-blue-700 text-white py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">About This System</h2>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          A web-based Crime Mapping and Safety Analysis System developed for Kano Metropolis
        </p>
      </div>

      <div className="p-6 max-w-4xl mx-auto">

        {/* Project Overview */}
        <div className={cardClass + ' mt-6'}>
          <h3 className={headingClass}>📋 Project Overview</h3>
          <p className={`leading-relaxed mb-4 ${textClass}`}>
            The <strong>Kano Crime Mapping and Safety Analysis System</strong> is a web-based
            platform designed to visualize, analyze and track crime patterns across the
            7 Local Government Areas (LGAs) of Kano City, Nigeria.
          </p>
          <p className={`leading-relaxed ${textClass}`}>
            The system enables the public to view crime incidents on an interactive map,
            submit crime reports, and access safety alerts. Law enforcement administrators
            can verify reports, issue alerts, and analyze weekly crime trends through a
            dedicated dashboard.
          </p>
        </div>

        {/* Objectives */}
        <div className={cardClass}>
          <h3 className={headingClass}>🎯 Objectives</h3>
          <div className="flex flex-col gap-3">
            {[
              'Provide an interactive crime map for Kano City',
              'Enable the public to report crime incidents online',
              'Help law enforcement identify crime hotspots and patterns',
              'Issue timely safety alerts to the public',
              'Track weekly crime frequency and risk levels per LGA',
              'Support data-driven decision making for public safety',
            ].map((obj, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                  darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  {i + 1}
                </div>
                <p className={textClass}>{obj}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className={cardClass}>
          <h3 className={headingClass}>🗺️ System Scope — 7 LGAs of Kano City</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Dala', 'Fagge', 'Gwale', 'Kano Municipal',
              'Nassarawa', 'Tarauni', 'Ungogo'].map(lga => (
              <div
                key={lga}
                className={`border rounded-xl p-4 text-center ${
                  darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="text-2xl mb-1">📍</div>
                <div className={`font-semibold text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>{lga}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className={cardClass}>
          <h3 className={headingClass}>✅ System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🗺️', title: 'Interactive Crime Map', desc: 'View all crimes on a real map of Kano City with colored markers by crime type' },
              { icon: '🔍', title: 'Search & Filter', desc: 'Filter crimes by type, LGA, date or search by keyword' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Weekly crime statistics, risk assessment and carry forward tracking' },
              { icon: '📋', title: 'Crime Reporting', desc: 'Submit crime reports with exact location using map picker' },
              { icon: '🚨', title: 'Safety Alerts', desc: 'Real-time safety alerts for specific LGAs issued by administrators' },
              { icon: '🔐', title: 'Admin Panel', desc: 'Secure admin portal to verify reports and manage the system' },
              { icon: '📈', title: 'Charts & Graphs', desc: 'Bar charts and pie charts for visual crime analysis' },
              { icon: '🌙', title: 'Dark Mode', desc: 'Toggle between light and dark mode for comfortable viewing' },
            ].map(feature => (
              <div
                key={feature.title}
                className={`flex items-start gap-3 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className={cardClass}>
          <h3 className={headingClass}>🔧 Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { category: 'Frontend', color: 'border-blue-500', items: ['React.js', 'Tailwind CSS', 'Leaflet.js', 'Recharts'] },
              { category: 'Backend', color: 'border-orange-500', items: ['Node.js', 'Express.js', 'JWT Auth', 'REST API'] },
              { category: 'Database', color: 'border-green-500', items: ['PostgreSQL', 'Sequelize ORM', 'pgAdmin'] },
            ].map(stack => (
              <div
                key={stack.category}
                className={`border-t-4 ${stack.color} rounded-xl p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stack.category}</h4>
                {stack.items.map(item => (
                  <div key={item} className="flex items-center gap-2 py-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div className={cardClass}>
          <h3 className={headingClass}>👩‍💻 Developer</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              T
            </div>
            <div>
              <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tahira Abdulmalik</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Final Year Student — Software Engineering</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Capital City University Kano</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Student ID: U22SWE1005</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-700 rounded-xl p-8 text-white text-center mb-6">
          <h3 className="text-xl font-bold mb-3">Ready to explore the system?</h3>
          <p className="text-blue-100 mb-6">View crime patterns across Kano City or report an incident</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/map')}
              className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300"
            >
              🗺️ View Crime Map
            </button>
            <button
              onClick={() => navigate('/report')}
              className="bg-white text-blue-700 px-6 py-2 rounded-lg font-bold hover:bg-blue-50"
            >
              📋 Report a Crime
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4 text-sm">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}