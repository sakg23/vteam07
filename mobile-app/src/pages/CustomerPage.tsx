import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import './CustomerPage.css';

interface Scooter {
  id: number;
  lat: number;
  lng: number;
}

interface User {
  displayName: string;
  role?: string;
}

const CustomerPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [user, setUser] = useState<User | null>(null);
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [address, setAddress] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const searchMarker = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Fetch user data from backend (mocked or via API if needed)
    setUser({ displayName: 'Google User', role: 'customer' });

    // Initialize map
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([57.7072, 11.9668], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    // Load scooters
    axios.get('/api/scooters')
      .then(res => {
        setScooters(res.data);
        if (leafletMap.current) {
          const group = L.featureGroup();
          res.data.forEach((scooter: Scooter) => {
            const marker = L.marker([scooter.lat, scooter.lng]).bindPopup(`Scooter ${scooter.id}`);
            marker.addTo(group);
          });
          group.addTo(leafletMap.current);
          if (res.data.length > 1) {
            leafletMap.current.fitBounds(group.getBounds());
          }
        }
      })
      .catch(() => alert('Failed to load scooters.'));
  }, []);

  const handleSearch = () => {
    if (!address) return alert('Please enter an address!');
    axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(res => {
        if (res.data.length === 0) return alert('Address not found!');
        const { lat, lon } = res.data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        if (leafletMap.current) {
          if (searchMarker.current) leafletMap.current.removeLayer(searchMarker.current);
          searchMarker.current = L.marker([latNum, lonNum])
            .addTo(leafletMap.current)
            .bindPopup(`Your chosen location: ${address}`)
            .openPopup();
          leafletMap.current.setView([latNum, lonNum], 15);
        }
      })
      .catch(() => alert('Failed to search address.'));
  };

  return (
    <div className="customer-page">
      <h1>Welcome, {user ? user.displayName : 'Guest'}</h1>

      <nav>
        <a href="/customer">🏠 Dashboard</a> |
        {!user ? (
          <a href="/auth/google">🔐 Login with Google</a>
        ) : (
          <>
            <a href="/logout">🚪 Logout</a>
            {user.role === 'admin' && <span> | <a href="/admin/dashboard">🛡 Admin</a></span>}
          </>
        )}
      </nav>

      {query.get('message') === 'success' && <div className="success">✅ You successfully rented the scooter!</div>}
      {query.get('message') === 'payment_success' && <div className="success">✅ Your payment was successful!</div>}

      <div className="address-search">
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Enter address..."
        />
        <button onClick={handleSearch}>Find Location</button>
      </div>

      <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }}></div>

      <form action="/rent/2" method="POST">
        <button type="submit">🚲 Rent Scooter 2</button>
      </form>

      <form action="/return/2" method="POST">
        <button type="submit">🔙 Return Scooter 2</button>
      </form>

      <a href="/payment">
        <button>💳 Go to Payment</button>
      </a>
    </div>
  );
};

export default CustomerPage;
