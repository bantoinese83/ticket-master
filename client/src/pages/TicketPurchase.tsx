import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { TicketType } from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import { purchaseSchema } from '../utils/validation';

const TicketPurchase: React.FC = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/ticket-types').then(res => {
      setTicketTypes(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors([]);
    // Validate client-side
    const result = purchaseSchema.safeParse({
      ticketTypeId: selectedType,
      quantity,
      attendee: { fullName, email, phone },
    });
    if (!result.success) {
      setValidationErrors(result.error.errors.map(e => e.message));
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post('/api/tickets/purchase', {
        ticketTypeId: selectedType,
        quantity,
        attendee: { fullName, email, phone },
      });
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setError('Failed to initiate payment.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Purchase failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Buy Event Ticket</h2>
      <form onSubmit={handlePurchase} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Ticket Type</label>
          <select
            className="w-full border rounded p-2"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            required
          >
            <option value="">Select a ticket type</option>
            {ticketTypes.map(type => (
              <option key={type.id || type._id} value={type.id || type._id}>
                {type.name} - {type.price} {type.currency} ({type.quantityAvailable} left)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            min={1}
            max={ticketTypes.find(t => t.id === selectedType || t._id === selectedType)?.quantityAvailable || 10}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        {validationErrors.length > 0 && (
          <div className="text-red-500">
            {validationErrors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Buy Ticket'}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-500">
        After clicking "Buy Ticket", you will be redirected to Paystack to complete your payment.<br />
        <b>Do not close this window until payment is complete.</b>
      </div>
    </div>
  );
};

export default function TicketPurchaseWithBoundary() {
  // Simple error boundary for this page
  try {
    return <TicketPurchase />;
  } catch (err) {
    return <div className="text-red-600 p-4">Something went wrong. Please refresh the page.</div>;
  }
} 