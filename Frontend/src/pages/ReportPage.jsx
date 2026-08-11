import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function SearchField({ onLocationSelect }) {
  const map = useMapEvents({});

  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: { countrycodes: 'ng', limit: 5 },
    });

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Search for a location in Kano...',
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result) => {
      onLocationSelect(result.location.y, result.location.x);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const lgaList = [
  'Dala', 'Fagge', 'Gwale', 'Kano Municipal',
  'Nassarawa', 'Tarauni', 'Ungogo'
];

const lgaIds = {
  'Dala': 1, 'Fagge': 2, 'Gwale': 3,
  'Kano Municipal': 4, 'Nassarawa': 5,
  'Tarauni': 6, 'Ungogo': 7
};

const crimeTypes = [
  'Armed Robbery', 'Robbery', 'Theft',
  'Assault', 'Burglary', 'Vandalism',
  'Kidnapping', 'Other',
];

export default function ReportPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', crime_type: '',
    lga: '', address: '', occurred_at: '', victim_count: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.crime_type || !form.lga || !form.occurred_at) {
      toast.error('Please fill in all required fields!');
      return;
    }
    if (!selectedLocation) {
      toast.error('Please select the exact crime location on the map!');
      return;
    }

    setLoading(true);

    try {
      await API.post('/crimes', {
        title: form.crime_type,
        description: form.description || form.title,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address: form.address || form.lga,
        occurred_at: form.occurred_at,
        source: 'public',
        victim_count: parseInt(form.victim_count),
        lga_id: lgaIds[form.lga],
      });
      toast.success('Crime report submitted successfully! ✅');
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to submit report. Please try again!');
    }

    setLoading(false);
  };

  const inputClass = `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
  }`;
  const labelClass = `block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  if (submitted) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <nav className="bg-blue-700 px-6 py-4 flex justify-between items-center shadow-md">
          <h1 onClick={() => navigate('/')} className="text-xl font-bold text-white cursor-pointer">
            🗺️ Kano Crime Mapping System
          </h1>
        </nav>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className={`rounded-2xl shadow-lg p-10 text-center max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-6xl mb-4">✅</div>
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Report Submitted!
            </h2>
            <p className={darkMode ? 'text-gray-400 mb-6' : 'text-gray-500 mb-6'}>
              Your crime report has been saved to the database and will appear on the map shortly.
            </p>
            <div className={`rounded-lg p-4 mb-6 text-left border ${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
              <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Report Summary:</p>
              <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>🔹 Type: {form.crime_type}</p>
              <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>🔹 LGA: {form.lga}</p>
              <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>🔹 Date: {form.occurred_at}</p>
              <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                🔹 Location: {selectedLocation?.lat.toFixed(4)}, {selectedLocation?.lng.toFixed(4)}
              </p>
              <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>🔹 Status: Pending Verification</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/map')}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                View on Map
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedLocation(null);
                  setForm({ title: '', description: '', crime_type: '', lga: '', address: '', occurred_at: '', victim_count: 1 });
                }}
                className={`px-6 py-2 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <nav className="bg-blue-700 px-6 py-4 flex justify-between items-center shadow-md">
        <h1 onClick={() => navigate('/')} className="text-xl font-bold text-white cursor-pointer">
          🗺️ Kano Crime Mapping System
        </h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="text-white hover:text-yellow-300 font-medium">Home</button>
          <button onClick={() => navigate('/map')} className="text-white hover:text-yellow-300 font-medium">Map</button>
          <button onClick={() => navigate('/dashboard')} className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Dashboard</button>
        </div>
      </nav>

      <div className="p-6 max-w-2xl mx-auto">
        <div className={`rounded-2xl shadow-lg p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📋 Submit Crime Report
          </h2>
          <p className={darkMode ? 'text-gray-400 mb-6' : 'text-gray-500 mb-6'}>
            Fill in the details and search or click on the map to mark the exact crime location.
          </p>

          <div className="mb-4">
            <label className={labelClass}>Report Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Armed robbery at Kofar Mata" className={inputClass} />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Crime Type <span className="text-red-500">*</span></label>
            <select name="crime_type" value={form.crime_type} onChange={handleChange} className={inputClass}>
              <option value="">Select crime type</option>
              {crimeTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className={labelClass}>LGA <span className="text-red-500">*</span></label>
            <select name="lga" value={form.lga} onChange={handleChange} className={inputClass}>
              <option value="">Select LGA</option>
              {lgaList.map(lga => <option key={lga} value={lga}>{lga}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Street Address / Area</label>
            <input type="text" name="address" value={form.address} onChange={handleChange}
              placeholder="e.g. Near Kofar Mata Market" className={inputClass} />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Date & Time <span className="text-red-500">*</span></label>
            <input type="datetime-local" name="occurred_at" value={form.occurred_at} onChange={handleChange} className={inputClass} />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Number of Victims</label>
            <input type="number" name="victim_count" value={form.victim_count} onChange={handleChange} min="1" className={inputClass} />
          </div>

          <div className="mb-6">
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Describe what happened..." className={inputClass} />
          </div>

          <div className="mb-6">
            <label className={`${labelClass} mb-2`}>
              📍 Search or click on map to mark exact location <span className="text-red-500">*</span>
            </label>

            {selectedLocation ? (
              <div className={`rounded-lg px-4 py-2 mb-2 text-sm border ${darkMode ? 'bg-green-900 border-green-700 text-green-300' : 'bg-green-50 border-green-300 text-green-700'}`}>
                ✅ Location selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            ) : (
              <div className={`rounded-lg px-4 py-2 mb-2 text-sm border ${darkMode ? 'bg-yellow-900 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-300 text-yellow-700'}`}>
                ⚠️ Use the search bar on the map or click to select location
              </div>
            )}

            <div style={{ height: '320px', borderRadius: '10px', overflow: 'hidden' }} className="shadow border border-gray-200">
              <MapContainer center={[12.0022, 8.5919]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                <SearchField onLocationSelect={handleLocationSelect} />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} />}
              </MapContainer>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Crime Report'}
          </button>
        </div>
      </div>

      <footer className="bg-blue-700 text-white text-center py-4 text-sm mt-8">
        Kano Crime Mapping & Safety Analysis System — Final Year Project
      </footer>
    </div>
  );
}