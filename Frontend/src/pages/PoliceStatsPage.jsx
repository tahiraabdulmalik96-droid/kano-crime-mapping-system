import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { policeStatistics, getPoliceStatsSummary } from '../data/policeStatisticsData';
import { useTheme } from '../context/ThemeContext';

export default function PoliceStatsPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [selectedDivision, setSelectedDivision] = useState('fagge');

  const summary = getPoliceStatsSummary();
  const division = policeStatistics[selectedDivision];

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

      <div className="p-6 max-w-5xl mx-auto">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          📋 Official Police Crime Statistics
        </h2>
        <p className={darkMode ? 'text-gray-400 mb-6' : 'text-gray-500 mb-6'}>
          Source: Kano State Police Command — Division Returns (2024/2025)
        </p>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className={`rounded-xl shadow p-4 text-center border-t-4 border-blue-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-blue-500">{summary.totalDivisions}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Divisions Reported</div>
          </div>
          <div className={`rounded-xl shadow p-4 text-center border-t-4 border-red-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-red-500">{summary.totalReported}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Cases Reported</div>
          </div>
        </div>

        {/* Division selector */}
        <div className={`rounded-xl shadow p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Select Division:</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(policeStatistics).map(([key, d]) => (
              <button
                key={key}
                onClick={() => setSelectedDivision(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDivision === key
                    ? 'bg-blue-700 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d.division}
              </button>
            ))}
          </div>
        </div>

        {/* Division details */}
        <div className={`rounded-xl shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {division.division} — {division.year}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}>
              LGA: {division.lga}
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
                <th className="text-left py-2">Crime Type</th>
                <th className="text-left py-2">Reported</th>
                <th className="text-left py-2">Arrested</th>
                <th className="text-left py-2">Charged</th>
                <th className="text-left py-2">Convicted</th>
              </tr>
            </thead>
            <tbody>
              {division.crimes.map((crime, i) => (
                <tr key={i} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className={`py-2 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{crime.type}</td>
                  <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{crime.reported ?? '-'}</td>
                  <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{crime.arrested ?? crime.prosecuted ?? '-'}</td>
                  <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{crime.charged ?? '-'}</td>
                  <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{crime.convicted ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="bg-blue-700 text-white text-center py-4 text-sm mt-8">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}