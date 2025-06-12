import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const [amount, setAmount] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  axios.get('http://localhost:5000/api/payment', { withCredentials: true })
    .then(res => setAmount(res.data.amount))
    .catch(() => alert(' Failed to load payment info.'));
}, []);

const handlePayment = async () => {
  try {
    await axios.post('http://localhost:5000/api/payment/confirm', {}, { withCredentials: true });
    navigate('/customer?message=payment_success');
  } catch (err) {
    console.error(err);
    alert(' Failed to confirm payment.');
  }
};

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>💳 Payment</h1>
      <p>Your total: <strong>{amount ?? '...'}</strong> SEK</p>

      <button
        onClick={handlePayment}
        style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
        disabled={amount === null}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
