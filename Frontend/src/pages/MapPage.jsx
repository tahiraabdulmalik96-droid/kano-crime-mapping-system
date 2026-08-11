import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllCrimes } from '../services/crimeService';
import { useTheme } from '../context/ThemeContext';

const createColoredIcon = (color) => {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 16px;
      height: 16px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const crimeColors = {
  'Armed Robbery': '#ef4444',
  'Robbery': '#f97316',
  'Theft': '#eab308',
  'Assault': '#a855f7',
  'Burglary': '#3b82f6',
  'Other': '#6b7280',
};

const sampleCrimes = [
  { id: 1, title: "Armed Robbery", latitude: 12.0022, longitude: 8.5919, address: "Kofar Mata", lga_id: 4, occurred_at: "2024-01-15", status: "verified" },
  { id: 2, title: "Theft", latitude: 12.0150, longitude: 8.5200, address: "Dangi", lga_id: 5, occurred_at: "2024-01-20", status: "verified" },
  { id: 3, title: "Assault", latitude: 11.9900, longitude: 8.5650, address: "Fagge D2", lga_id: 2, occurred_at: "2024-02-05", status: "verified" },
  { id: 4, title: "Burglary", latitude: 12.0300, longitude: 8.5100, address: "Gwale", lga_id: 3, occurred_at: "2024-02-10", status: "pending" },
  { id: 5, title: "Robbery", latitude: 12.0400, longitude: 8.6000, address: "Dala", lga_id: 1, occurred_at: "2024-02-18", status: "verified" },
  { id: 6, title: "Theft", latitude: 12.0200, longitude: 8.5400, address: "Tarauni", lga_id: 6, occurred_at: "2024-03-01", status: "verified" },
  { id: 7, title: "Armed Robbery", latitude: 12.0550, longitude: 8.5300, address: "Ungogo", lga_id: 7, occurred_at: "2024-03-10", status: "verified" },
  { id: 8, title: "Assault", latitude: 12.0100, longitude: 8.5750, address: "Sabon Gari", lga_id: 4, occurred_at: "2024-03-15", status: "verified" },
  { id: 9, title: "Robbery", latitude: 12.0250, longitude: 8.5600, address: "Tudun Wada", lga_id: 5, occurred_at: "2024-03-20", status: "verified" },
  { id: 10, title: "Theft", latitude: 11.9980, longitude: 8.5500, address: "Waje", lga_id: 2, occurred_at: "2024-04-01", status: "pending" },
];

const lgaNames = {
  1: 'Dala', 2: 'Fagge', 3: 'Gwale',
  4: 'Kano Municipal', 5: 'Nassarawa',
  6: 'Tarauni', 7: 'Ungogo'
};

export default function MapPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lgaFilter, setLgaFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [usingRealData, setUsingRealData] = useState(false);

  const crimeTypes = ['All', 'Armed Robbery', 'Robbery', 'Theft', 'Assault', 'Burglary'];
  const lgas = ['All', 'Dala', 'Fagge', 'Gwale', 'Kano Municipal', 'Nassarawa', 'Tarauni', 'Ungogo'];

  useEffect(() => {
    const fetchCrimes = async () => {
      try {
        const data = await getAllCrimes();
        if (data && data.length > 0) {
          setCrimes(data);
          setUsingRealData(true);
        } else {
          setCrimes(sampleCrimes);
          setUsingRealData(false);
        }
      } catch (error) {
        console.error('Using sample data:', error);
        setCrimes(sampleCrimes);
        setUsingRealData(false);
      }
      setLoading(false);
    };
    fetchCrimes();
  }, []);

  const filteredCrimes = crimes.filter(c => {
    const matchType = filter === 'All' || c.title === filter;
    const matchLGA = lgaFilter === 'All' ||
      lgaNames[c.lga_id] === lgaFilter ||
      c.lga === lgaFilter;
    const matchSearch = searchQuery === '' ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lgaNames[c.lga_id]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.occurred_at?.includes(searchQuery);
    return matchType && matchLGA && matchSearch;
  });

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
          <button onClick={() => navigate('/dashboard')} className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Dashboard</button>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">
          🗺️ Crime Map — Kano City
        </h2>

        {/* Data source indicator */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
          usingRealData
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${usingRealData ? 'bg-green-500' : 'bg-yellow-500'}`} />
          {usingRealData ? 'Live Data from Database' : 'Using Sample Data'}
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by crime type, location, LGA or date (e.g. robbery, Dala, 2024-01)..."
              className={`w-full border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 shadow-sm ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className={`text-xs mt-1 ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Found <strong>{filteredCrimes.length}</strong> result{filteredCrimes.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Filter by Crime Type */}
        <div className="mb-3">
          <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Filter by Crime Type:</p>
          <div className="flex gap-2 flex-wrap">
            {crimeTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  background: filter === type ? (crimeColors[type] || '#2563eb') : (darkMode ? '#374151' : '#e5e7eb'),
                  color: filter === type ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
                }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Filter by LGA — with hover crime count */}
        <div className="mb-4">
          <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Filter by LGA:</p>
          <div className="flex gap-2 flex-wrap">
            {lgas.map(lga => {
              const lgaCrimeCount = lga === 'All'
                ? crimes.length
                : crimes.filter(c => lgaNames[c.lga_id] === lga).length;
              return (
                <div key={lga} className="relative group">
                  <button
                    onClick={() => setLgaFilter(lga)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      lgaFilter === lga
                        ? 'bg-blue-700 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {lga}
                  </button>
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                      <strong>{lgaCrimeCount}</strong> crime{lgaCrimeCount !== 1 ? 's' : ''} recorded
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className={`flex gap-4 mb-4 flex-wrap p-3 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {Object.entries(crimeColors).slice(0, 5).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div style={{ background: color }} className="w-3 h-3 rounded-full" />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{type}</span>
            </div>
          ))}
        </div>

        {/* Search Results List */}
        {searchQuery && filteredCrimes.length > 0 && (
          <div className={`rounded-xl shadow p-4 mb-4 max-h-48 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Search Results:
            </p>
            {filteredCrimes.map(crime => (
              <div
                key={crime.id}
                className={`flex items-center gap-3 py-2 border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
              >
                <div
                  style={{ background: crimeColors[crime.title] || '#6b7280' }}
                  className="w-3 h-3 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {crime.title}
                  </span>
                  <span className="text-gray-400 text-xs mx-2">—</span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    📍 {crime.address || lgaNames[crime.lga_id] || 'Unknown'}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {new Date(crime.occurred_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {searchQuery && filteredCrimes.length === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
            <p className="text-red-600 text-sm">
              No incidents found for "<strong>{searchQuery}</strong>"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 text-xs mt-1 underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Map */}
        {loading ? (
          <div className={`flex items-center justify-center h-96 rounded-xl shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-700 border-t-transparent mx-auto mb-4"></div>
              <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Loading crime data...</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fetching from database</p>
            </div>
          </div>
        ) : (
          <div
            style={{ height: '520px', borderRadius: '12px', overflow: 'hidden' }}
            className="shadow-lg"
          >
            <MapContainer
              center={[12.0022, 8.5919]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {filteredCrimes.map(crime => (
                <Marker
                  key={crime.id}
                  position={[
                    parseFloat(crime.latitude),
                    parseFloat(crime.longitude)
                  ]}
                  icon={createColoredIcon(crimeColors[crime.title] || '#6b7280')}
                >
                  <Popup>
                    <div style={{ minWidth: '160px' }}>
                      <strong style={{ color: crimeColors[crime.title] }}>
                        {crime.title}
                      </strong>
                      <br />
                      📍 {crime.address || 'N/A'}
                      <br />
                      🏙️ {lgaNames[crime.lga_id] || 'N/A'} LGA
                      <br />
                      📅 {new Date(crime.occurred_at).toLocaleDateString()}
                      <br />
                      <span className={`text-xs ${
                        crime.status === 'verified' ? 'text-green-600' :
                        crime.status === 'pending' ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        ● {crime.status || 'N/A'}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Crime Count */}
        <div className={`mt-3 rounded-lg p-3 shadow-sm text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
          Showing <strong>{filteredCrimes.length}</strong> crime{filteredCrimes.length !== 1 ? 's' : ''}
          {filter !== 'All' ? ` — ${filter}` : ''}
          {lgaFilter !== 'All' ? ` in ${lgaFilter} LGA` : ' across all LGAs'}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4 text-sm mt-4">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}