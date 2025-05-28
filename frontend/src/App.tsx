import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/admin/Dashboard';
import Bikes from './components/admin/Bikes';
import Stations from './components/admin/Station';
import Customers from './components/admin/Customer';
import AdminMap from './components/admin/Map';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/bikes" element={<Bikes />} />
        <Route path="/admin/stations" element={<Stations />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/map" element={<AdminMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
