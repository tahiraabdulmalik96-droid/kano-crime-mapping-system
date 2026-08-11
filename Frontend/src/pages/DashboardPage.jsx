import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts';

const weeks = [
  { label: 'Week 1 (Jan 1-7)', start: '2024-01-01', end: '2024-01-07' },
  { label: 'Week 2 (Jan 8-21)', start: '2024-01-08', end: '2024-01-21' },
  { label: 'Week 3 (Jan 22 - Feb 10)', start: '2024-01-22', end: '2024-02-10' },
  { label: 'Week 4 (Feb 11 - Mar 1)', start: '2024-02-11', end: '2024-03-01' },
];

const riskBadge = {
  'High': 'bg-red-100 text-red-700 border border-red-300',
  'Medium': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  'Low': 'bg-green-100 text-green-700 border border-green-300',
};

const riskBar = {
  'High': 'bg-red-500',
  'Medium': 'bg-yellow-400',
  'Low': 'bg-green-500',
};

const crimeTypeColors = {
  'Armed Robbery': '#ef4444',
  'Robbery': '#f97316',
  'Theft': '#eab308',
  'Assault': '#a855f7',
  'Burglary': '#3b82f6',
  'Vandalism': '#6b7280',
  'Kidnapping': '#dc2626',
  'Other': '#9ca3af',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedWeek]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/dashboard/weekly?week_start=${selectedWeek.start}&week_end=${selectedWeek.end}`
      );
      setData(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  const totalCases = data?.totalCases || 0;
  const totalPending = data?.totalPending || 0;
  const totalVerified = data?.totalVerified || 0;
  const highRisk = data?.highRisk || 0;
  const lgaStats = data?.lgaStats || [];
  const crimeTypes = data?.crimeTypes || {};
  const carryForward = totalPending;
  const currentIndex = weeks.indexOf(selectedWeek);
  const nextWeek = weeks[currentIndex + 1] || null;

  const pieData = Object.entries(crimeTypes).map(([name, value]) => ({
    name,
    value,
  }));

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(29, 78, 216);
    doc.text('Kano Crime Mapping & Safety Analysis System', 14, 15);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Crime Analytics Report — ${selectedWeek.label}`, 14, 23);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, 14, 29);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Statistics', 14, 40);

    autoTable(doc, {
      startY: 44,
      head: [['Total Cases', 'Verified', 'Pending', 'High Risk LGAs', 'Carry Forward']],
      body: [[totalCases, totalVerified, totalPending, highRisk, carryForward]],
      theme: 'grid',
      headStyles: { fillColor: [29, 78, 216] },
    });

    doc.text('Weekly Crime Frequency by LGA', 14, doc.lastAutoTable.finalY + 10);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 14,
      head: [['LGA', 'Total Cases', 'Verified', 'Pending', 'Risk Level']],
      body: lgaStats.map(lga => [lga.name, lga.cases, lga.verified, lga.pending, lga.risk]),
      theme: 'grid',
      headStyles: { fillColor: [29, 78, 216] },
    });

    if (Object.keys(crimeTypes).length > 0) {
      doc.text('Crime Types Breakdown', 14, doc.lastAutoTable.finalY + 10);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 14,
        head: [['Crime Type', 'Count']],
        body: Object.entries(crimeTypes).map(([type, count]) => [type, count]),
        theme: 'grid',
        headStyles: { fillColor: [29, 78, 216] },
      });
    }

    doc.save(`Crime_Report_${selectedWeek.label.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
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
          <button onClick={() => navigate('/map')} className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Crime Map</button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">
          📊 Crime Analytics Dashboard — Kano City
        </h2>

        {/* Last Updated + Refresh */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Weekly crime frequency, risk assessment and case tracking
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {lastUpdated && (
              <div className={`border rounded-lg px-4 py-2 text-sm flex items-center gap-2 ${
                darkMode ? 'bg-blue-900 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                🕐 Last updated: {lastUpdated.toLocaleString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>
            )}
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Week Selector */}
        <div className={`rounded-xl shadow p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>📅 Select Week:</p>
          <div className="flex gap-2 flex-wrap">
            {weeks.map(week => (
              <button
                key={week.label}
                onClick={() => setSelectedWeek(week)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedWeek.label === week.label
                    ? 'bg-blue-700 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {week.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExportPDF}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-500 flex items-center gap-2 text-sm"
          >
            📄 Export PDF Report
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-700 border-t-transparent mb-4"></div>
            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Loading dashboard data...</p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fetching weekly statistics</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className={`rounded-xl shadow p-4 text-center border-t-4 border-blue-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-3xl font-bold text-blue-500">{totalCases}</div>
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Cases</div>
              </div>
              <div className={`rounded-xl shadow p-4 text-center border-t-4 border-green-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-3xl font-bold text-green-500">{totalVerified}</div>
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verified</div>
              </div>
              <div className={`rounded-xl shadow p-4 text-center border-t-4 border-yellow-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-3xl font-bold text-yellow-500">{totalPending}</div>
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</div>
              </div>
              <div className={`rounded-xl shadow p-4 text-center border-t-4 border-red-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-3xl font-bold text-red-500">{highRisk}</div>
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>High Risk LGAs</div>
              </div>
              <div className={`rounded-xl shadow p-4 text-center border-t-4 border-purple-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-3xl font-bold text-purple-500">{carryForward}</div>
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Carry Forward</div>
              </div>
            </div>

            {/* Carry Forward Notice */}
            {totalPending > 0 && (
              <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 border ${
                darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-300'
              }`}>
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Pending Cases Notice</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    <strong>{totalPending} pending cases</strong> from {selectedWeek.label} will be carried forward
                    {nextWeek ? ` to ${nextWeek.label}.` : ' to the next week.'}
                    These require immediate attention and verification.
                  </p>
                </div>
              </div>
            )}

            {/* Bar Chart */}
            {lgaStats.length > 0 && (
              <div className={`rounded-xl shadow p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-bold mb-4">📊 Crime Count by LGA</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={lgaStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: darkMode ? '#d1d5db' : '#374151' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: darkMode ? '#d1d5db' : '#374151' }} />
                    <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: '#fff' } : {}} />
                    <Bar dataKey="cases" name="Total Cases" radius={[4, 4, 0, 0]}>
                      {lgaStats.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.risk === 'High' ? '#ef4444' :
                            entry.risk === 'Medium' ? '#eab308' :
                            '#22c55e'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className={`text-xs text-center mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  🔴 High Risk &nbsp; 🟡 Medium Risk &nbsp; 🟢 Low Risk
                </p>
              </div>
            )}

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <div className={`rounded-xl shadow p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-bold mb-4">🥧 Crime Types Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={crimeTypeColors[entry.name] || '#6b7280'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={darkMode ? { backgroundColor: '#1f2937', border: 'none', color: '#fff' } : {}} />
                    <Legend wrapperStyle={darkMode ? { color: '#d1d5db' } : {}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weekly Risk Table */}
            <div className={`rounded-xl shadow p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-bold mb-4">📋 Weekly Crime Frequency & Risk Assessment</h3>
              {lgaStats.every(l => l.cases === 0) ? (
                <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No crime data for this week.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
                      <th className="text-left py-3">LGA</th>
                      <th className="text-left py-3">Total Cases</th>
                      <th className="text-left py-3">Verified</th>
                      <th className="text-left py-3">Pending</th>
                      <th className="text-left py-3">Risk Level</th>
                      <th className="text-left py-3">Frequency Bar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lgaStats.map(lga => (
                      <tr key={lga.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <td className="py-3 font-semibold">{lga.name}</td>
                        <td className={`py-3 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{lga.cases}</td>
                        <td className="py-3 text-green-500 font-medium">{lga.verified}</td>
                        <td className="py-3 text-yellow-500 font-medium">{lga.pending}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskBadge[lga.risk]}`}>
                            {lga.risk}
                          </span>
                        </td>
                        <td className="py-3 w-40">
                          <div className={`rounded-full h-2.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                              className={`${riskBar[lga.risk]} h-2.5 rounded-full`}
                              style={{
                                width: totalCases > 0
                                  ? `${(lga.cases / Math.max(...lgaStats.map(l => l.cases), 1)) * 100}%`
                                  : '0%'
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Crime Types Breakdown */}
            {Object.keys(crimeTypes).length > 0 && (
              <div className={`rounded-xl shadow p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-bold mb-4">Crime Types Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(crimeTypes).map(([type, count]) => (
                    <div
                      key={type}
                      className="rounded-xl p-4 text-center shadow-sm border-t-4"
                      style={{ borderColor: crimeTypeColors[type] || '#6b7280' }}
                    >
                      <div className="text-3xl font-bold" style={{ color: crimeTypeColors[type] || '#6b7280' }}>
                        {count}
                      </div>
                      <div className={`text-xs mt-1 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Legend */}
            <div className={`rounded-xl shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Risk Level Criteria</h3>
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">High</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>3 or more cases per week</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-300">Medium</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 cases per week</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">Low</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1 or fewer cases per week</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="bg-blue-700 text-white text-center py-4 text-sm mt-4">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}