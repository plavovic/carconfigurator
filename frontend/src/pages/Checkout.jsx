import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ totalAmount: 0 }), // replace with real totals/config
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error(text || 'Unexpected response from server');
      }
      if (!res.ok) throw new Error(data.message || 'Checkout failed');
      setOrder(data.order);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>

      {!order && (
        <>
          <p>Review your configuration and place the order.</p>
          <button onClick={placeOrder} disabled={loading} style={{ padding: '10px 16px', borderRadius: 8 }}>
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </>
      )}

      {order && (
        <div style={{ marginTop: 24 }}>
          <h3>Order Confirmed</h3>
          <div>Order ID: {order.order_number || order.id}</div>
          <div>Created: {new Date(order.created_at).toLocaleString()}</div>
          <div style={{ marginTop: 8, color: '#0a7' }}>A confirmation email has been sent.</div>
        </div>
      )}
    </div>
  );
}
