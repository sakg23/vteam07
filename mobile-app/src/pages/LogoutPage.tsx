import React, { useEffect } from 'react';

const LogoutPage: React.FC = () => {
  useEffect(() => {
    window.location.href = '/logout';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Logging you out...</h1>
    </div>
  );
};

export default LogoutPage;
