import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ backgroundColor: '#222', color: 'white', padding: '1rem' }}>
      <h1>Svenska Elsparkcyklar AB – Adminpanel</h1>
      <nav>
        <Link to="/admin" style={{ color: 'white', marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/admin/bikes" style={{ color: 'white', marginRight: '1rem' }}>Cyklar</Link>
        <Link to="/admin/stations" style={{ color: 'white', marginRight: '1rem' }}>Stationer</Link>
        <Link to="/admin/customers" style={{ color: 'white', marginRight: '1rem' }}>Kunder</Link>
        <Link to="/admin/map" style={{ color: 'white' }}>Karta</Link>
      </nav>
    </header>
  );
};

export default Header;
