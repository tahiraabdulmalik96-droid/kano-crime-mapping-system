import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const lgaList = [
  { id: 1, name: 'Dala' },
  { id: 2, name: 'Fagge' },
  { id: 3, name: 'Gwale' },
  { id: 4, name: 'Kano Municipal' },
  { id: 5, name: 'Nassarawa' },
  { id: 6, name: 'Tarauni' },
  { id: 7, name: 'Ungogo' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [crimes, setCrimes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('reports');
  const [alertForm, setAlertForm] = useState({
    title: '', message: '', severity: 'warning', lga_id: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCrimes();
    fetchAlerts();
  }, []);

  const fetchCrimes = async () => {
    try {
      const response = await API.get('/crimes');
      setCrimes(response.data.crimes);
    } catch (error) {
      console.error('Error fetching crimes:', error);
    }
    setLoading(false);
  };

  const fetchAlerts = async () => {
    try {
      const response = await API.get('/alerts');
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/crimes/${id}/status`, { status });
      setCrimes(crimes.map(c => c.id === id ? { ...c, status } : c));
      setMessage(`Crime report ${status} successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update status!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAlertSubmit = async () => {
    if (!alertForm.title || !alertForm.message || !alertForm.severity) {
      setMessage('Please fill in all alert fields!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      await API.post('/alerts', { ...alertForm, lga_id: alertForm.lga_id || null });
      setMessage('Safety alert issued successfully!');
      setAlertForm({ title: '', message: '', severity: 'warning', lga_id: '' });
      fetchAlerts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to create alert!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deactivateAlert = async (id) => {
    try {
      await API.put(`/alerts/${id}/deactivate`);
      setAlerts(alerts.filter(a => a.id !== id));
      setMessage('Alert deactivated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to deactivate alert!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters!');
      return;
    }

    try {
      await API.post('/auth/change-password', {
        userId: user.id,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully! 🔒');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password!');
    }
  };

  const filteredCrimes = crimes.filter(c => filter === 'all' ? true : c.status === filter);

  const totalCrimes = crimes.length;
  const pendingCrimes = crimes.filter(c => c.status === 'pending').length;
  const verifiedCrimes = crimes.filter(c => c.status === 'verified').length;
  const rejectedCrimes = crimes.filter(c => c.status === 'rejected').length;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const severityColors = {
    info: darkMode ? 'bg-blue-900 text-blue-200 border border-blue-700' : 'bg-blue-100 text-blue-700 border border-blue-300',
    warning: darkMode ? 'bg-yellow-900 text-yellow-200 border border-yellow-700' : 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    danger: darkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-100 text-red-700 border border-red-300',
  };

  const severityIcons = { info: 'ℹ️', warning: '⚠️', danger: '🚨' };

  const cardClass = `rounded-xl shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`;
  const inputClass = `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
  }`;
  const labelClass = `block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className="bg-blue-700 px-6 py-4 flex justify-between items-center shadow-md flex-wrap gap-2">
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-bold text-white cursor-pointer"
        >
          🗺️ Kano Crime Mapping System
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-blue-200 text-sm">👤 {user.full_name || 'Admin'}</span>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50"
          >
            🔑 Change Password
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-400"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          ⚙️ Admin Panel
        </h2>
        <p className={darkMode ? 'text-gray-400 mb-6' : 'text-gray-500 mb-6'}>
          Manage crime reports and issue safety alerts
        </p>

        {/* Message */}
        {message && (
          <div className={`rounded-lg px-4 py-3 mb-4 text-sm border ${
            darkMode ? 'bg-green-900 border-green-700 text-green-300' : 'bg-green-50 border-green-300 text-green-700'
          }`}>
            ✅ {message}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-xl shadow p-4 text-center border-t-4 border-blue-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-blue-500">{totalCrimes}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Reports</div>
          </div>
          <div className={`rounded-xl shadow p-4 text-center border-t-4 border-yellow-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-yellow-500">{pendingCrimes}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</div>
          </div>
          <div className={`rounded-xl shadow p-4 text-center border-t-4 border-green-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-green-500">{verifiedCrimes}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verified</div>
          </div>
          <div className={`rounded-xl shadow p-4 text-center border-t-4 border-red-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-red-500">{rejectedCrimes}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rejected</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('reports')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === 'reports' ? 'bg-blue-700 text-white' : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            📋 Crime Reports
          </button>
          <button
            onClick={() => setTab('alerts')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === 'alerts' ? 'bg-blue-700 text-white' : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🚨 Safety Alerts {alerts.length > 0 && `(${alerts.length})`}
          </button>
        </div>

        {/* CRIME REPORTS TAB */}
        {tab === 'reports' && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              {[
                { key: 'all', label: 'All Reports', count: totalCrimes },
                { key: 'pending', label: 'Pending', count: pendingCrimes },
                { key: 'verified', label: 'Verified', count: verifiedCrimes },
                { key: 'rejected', label: 'Rejected', count: rejectedCrimes },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === t.key ? 'bg-blue-700 text-white' : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {loading ? (
                <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Loading crime reports...
                </div>
              ) : filteredCrimes.length === 0 ? (
                <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No crime reports found.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'bg-gray-900 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Crime Type</th>
                      <th className="text-left py-3 px-4">Address</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Source</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrimes.map(crime => (
                      <tr key={crime.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>#{crime.id}</td>
                        <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{crime.title}</td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{crime.address || 'N/A'}</td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {new Date(crime.occurred_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            crime.source === 'police' ? 'bg-blue-100 text-blue-700' :
                            crime.source === 'public' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {crime.source}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            crime.status === 'verified' ? 'bg-green-100 text-green-700' :
                            crime.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {crime.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {crime.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(crime.id, 'verified')}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-400"
                              >
                                ✅ Verify
                              </button>
                              <button
                                onClick={() => updateStatus(crime.id, 'rejected')}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-400"
                              >
                                ❌ Reject
                              </button>
                            </div>
                          )}
                          {crime.status === 'verified' && <span className="text-green-500 text-xs">✅ Verified</span>}
                          {crime.status === 'rejected' && <span className="text-red-500 text-xs">❌ Rejected</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ALERTS TAB */}
        {tab === 'alerts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Alert Form */}
            <div className={cardClass}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🚨 Issue New Safety Alert
              </h3>

              <div className="mb-4">
                <label className={labelClass}>Alert Title</label>
                <input
                  type="text"
                  value={alertForm.title}
                  onChange={e => setAlertForm({ ...alertForm, title: e.target.value })}
                  placeholder="e.g. High crime activity in Dala"
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <label className={labelClass}>Severity</label>
                <select
                  value={alertForm.severity}
                  onChange={e => setAlertForm({ ...alertForm, severity: e.target.value })}
                  className={inputClass}
                >
                  <option value="info">ℹ️ Info — General information</option>
                  <option value="warning">⚠️ Warning — Elevated risk</option>
                  <option value="danger">🚨 Danger — High risk area</option>
                </select>
              </div>

              <div className="mb-4">
                <label className={labelClass}>LGA (Optional)</label>
                <select
                  value={alertForm.lga_id}
                  onChange={e => setAlertForm({ ...alertForm, lga_id: e.target.value })}
                  className={inputClass}
                >
                  <option value="">All LGAs</option>
                  {lgaList.map(lga => (
                    <option key={lga.id} value={lga.id}>{lga.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Alert Message</label>
                <textarea
                  value={alertForm.message}
                  onChange={e => setAlertForm({ ...alertForm, message: e.target.value })}
                  rows={4}
                  placeholder="Describe the safety concern..."
                  className={inputClass}
                />
              </div>

              <button
                onClick={handleAlertSubmit}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-500 transition"
              >
                🚨 Issue Safety Alert
              </button>
            </div>

            {/* Active Alerts List */}
            <div className={cardClass}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📋 Active Alerts ({alerts.length})
              </h3>
              {alerts.length === 0 ? (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No active alerts at the moment
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-lg ${severityColors[alert.severity]}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">
                            {severityIcons[alert.severity]} {alert.title}
                          </p>
                          <p className="text-xs mt-1 opacity-80">{alert.message}</p>
                          <p className="text-xs mt-2 opacity-60">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deactivateAlert(alert.id)}
                          className="text-xs bg-white px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 ml-2 flex-shrink-0"
                        >
                          Deactivate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-lg p-6 w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🔑 Change Password
            </h3>

            <div className="mb-3">
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="mb-3">
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="mb-6">
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-blue-700 text-white text-center py-4 text-sm mt-8">
        Kano Crime Mapping & Safety Analysis System — Admin Panel
      </footer>
    </div>
  );
}