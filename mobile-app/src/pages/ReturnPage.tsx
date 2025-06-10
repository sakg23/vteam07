import React from 'react';
import { useParams } from 'react-router-dom';

const ReturnPage: React.FC = () => {
  const { scooterId } = useParams<{ scooterId: string }>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.submit();
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Return Scooter</h1>
      <p>Returning scooter ID: <strong>{scooterId}</strong></p>

      <form method="POST" action={`/return/${scooterId}`} onSubmit={handleSubmit}>
        <button type="submit" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          Confirm Return
        </button>
      </form>
    </div>
  );
};

export default ReturnPage;
