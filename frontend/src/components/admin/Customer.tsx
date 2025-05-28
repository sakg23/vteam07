import React, { useEffect, useState } from 'react';
import { User } from '../../types/User';
import axios from 'axios';
import Header from '../shared/Header';

const Customers = () => {
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    axios.get<User[]>('/api/users').then(res => setCustomers(res.data));
  }, []);

  return (
    <div>
      <Header />
      <h2>Kunder</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Namn</th><th>E-post</th><th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.balance} kr</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
