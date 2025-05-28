import React, { useEffect, useState } from 'react';
import { Bike } from '../../types/Bike';
import { Station } from '../../types/Station';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const AdminMap = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    axios.get<Bike[]>('/api/bikes').then(res => setBikes(res.data));
    axios.get<Station[]>('/api/stations').then(res => setStations(res.data));
  }, []);

  return (
    <MapContainer center={[59.3293, 18.0686]} zoom={13} style={{ height: "500px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {bikes.map((b: Bike) => (
        <Marker key={b.id} position={[b.location.lat, b.location.lng]}>
          <Popup>Cykel ID: {b.id}, Batteri: {b.battery}%</Popup>
        </Marker>
      ))}
      {stations.map((s: Station) => (
        <Marker key={s.id} position={[s.location.lat, s.location.lng]}>
          <Popup>Station: {s.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AdminMap;
