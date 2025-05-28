import React, { useEffect, useState } from 'react';
import { Bike } from '../../types/Bike';
import Header from '../shared/Header';
import axios from 'axios';

const Bikes = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);

  useEffect(() => {
    axios.get<Bike[]>('/api/bikes').then(res => setBikes(res.data));
  }, []);

  return (
    <div>
      <h2>Alla cyklar</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Stad</th><th>Status</th><th>Batteri</th>
          </tr>
        </thead>
        <tbody>
          {bikes.map(bike => (
            <tr key={bike.id}>
              <td>{bike.id}</td>
              <td>{bike.city}</td>
              <td>{bike.status}</td>
              <td>{bike.battery}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bikes;
