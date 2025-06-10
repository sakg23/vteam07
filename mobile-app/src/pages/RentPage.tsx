import React from 'react';
import { useParams } from 'react-router-dom';

const RentPage: React.FC = () => {
  const { scooterId } = useParams<{ scooterId: string }>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.submit();
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Rent Scooter</h1>
      <p>Renting scooter ID: <strong>{scooterId}</strong></p>

      <form method="POST" action={`/rent/${scooterId}`} onSubmit={handleSubmit}>
        <button type="submit" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          Confirm Rent
        </button>
      </form>
    </div>
  );
};

export default RentPage;
