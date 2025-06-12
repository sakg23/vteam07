import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReturnPage: React.FC = () => {
  const { scooterId } = useParams<{ scooterId: string }>();
  const navigate = useNavigate();

  const handleReturn = async () => {
    try {
      await axios.post(
        `http://localhost:5000/return/${scooterId}`,
        {},
        { withCredentials: true }
      );
      navigate('/payment');
    } catch (err) {
      console.error(err);
      alert(' Failed to return scooter.');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Return Scooter</h1>
      <p>Returning scooter ID: <strong>{scooterId}</strong></p>

      <button
        onClick={handleReturn}
        style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
      >
        Confirm Return
      </button>
    </div>
  );
};

export default ReturnPage;
