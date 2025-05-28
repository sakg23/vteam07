import React, { useEffect, useState } from 'react';
import { Bike } from '../../types/Bike';
import { Station } from '../../types/Station';
import { User } from '../../types/User';
import axios from 'axios';

const Dashboard = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('/api/bikes').then(res => setBikes(res.data));
    axios.get('/api/stations').then(res => setStations(res.data));
    axios.get('/api/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Antal cyklar: {bikes.length}</p>
      <p>Antal laddstationer: {stations.length}</p>
      <p>Antal kunder: {users.length}</p>
    </div>
  );
};

export default Dashboard;
