import React from 'react';

const PaymentPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit the form to the backend
    const form = e.target as HTMLFormElement;
    form.submit();
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Payment</h1>
      <p>Your total: <strong>50 SEK</strong></p>

      <form method="POST" action="/payment/confirm" onSubmit={handleSubmit}>
        <button type="submit" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
