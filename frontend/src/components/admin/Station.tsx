import React, { useEffect, useState } from 'react';
import { Station } from '../../types/Station';
import axios from 'axios';

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    axios.get('/api/stations').then(res => setStations(res.data));
  }, []);

  return (
    <div>
      <h2>Laddstationer</h2>
      {stations.map(station => (
        <div key={station.id}>
          <h4>{station.name} ({station.city})</h4>
          <p>Lat: {station.location.lat}, Lng: {station.location.lng}</p>
        </div>
      ))}
    </div>
  );
};

export default Stations;
