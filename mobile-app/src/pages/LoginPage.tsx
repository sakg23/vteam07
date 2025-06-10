import React from 'react';
import { useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const message = query.get('message');

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Login Page</h1>

      {message === 'logged_out' && (
        <div style={{ color: 'green', marginBottom: '1rem' }}>
          ✅ You have been logged out successfully.
        </div>
      )}

      <a href="/auth/google">
        <button style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          🔐 Login with Google
        </button>
      </a>
    </div>
  );
};

export default LoginPage;
