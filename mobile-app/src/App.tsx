import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import LoginPage from './pages/LoginPage';
import PaymentPage from './pages/PaymentPage';
import ReturnPage from './pages/ReturnPage';
import RentPage from './pages/RentPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/return/:scooterId" element={<ReturnPage />} />
        <Route path="/rent/:scooterId" element={<RentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
