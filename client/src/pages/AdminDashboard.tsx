import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { TicketType, Ticket } from '../../../shared/types';
import { ticketTypeSchema } from '../utils/validation';
// import { Button } from '@/components/ui/button';
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function logClient(message: string, data?: any) {
  // Simple client-side logger (could be extended to send to a server)
  // eslint-disable-next-line no-console
  console.log(`[CLIENT LOG] ${message}`, data);
}

const AdminDashboard: React.FC = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newType, setNewType] = useState({ name: '', price: '', currency: 'NGN', quantityAvailable: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const fetchData = async () => {
    const [typesRes, ticketsRes] = await Promise.all([
      axios.get('/api/ticket-types'),
      axios.get('/api/tickets'),
    ]);
    setTicketTypes(Array.isArray(typesRes.data) ? typesRes.data : []);
    setTickets(Array.isArray(ticketsRes.data) ? ticketsRes.data : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors([]);
    // Validate client-side
    const result = ticketTypeSchema.safeParse({
      ...newType,
      price: Number(newType.price),
      quantityAvailable: Number(newType.quantityAvailable),
    });
    if (!result.success) {
      setValidationErrors(result.error.errors.map(e => e.message));
      setLoading(false);
      logClient('Ticket type validation failed', result.error.errors);
      return;
    }
    try {
      await axios.post('/api/ticket-types', {
        ...newType,
        price: Number(newType.price),
        quantityAvailable: Number(newType.quantityAvailable),
      });
      setNewType({ name: '', price: '', currency: 'NGN', quantityAvailable: '', description: '' });
      fetchData();
      logClient('Ticket type created', newType);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create ticket type.');
      logClient('Ticket type creation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Create Ticket Type</h3>
        {validationErrors.length > 0 && (
          <div className="text-red-500">
            {validationErrors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
        <form onSubmit={handleCreateType} className="grid grid-cols-2 gap-4 mb-2">
          <input className="border p-2 rounded" placeholder="Name" value={newType.name} onChange={e => setNewType({ ...newType, name: e.target.value })} required />
          <input className="border p-2 rounded" placeholder="Price" type="number" value={newType.price} onChange={e => setNewType({ ...newType, price: e.target.value })} required />
          <input className="border p-2 rounded" placeholder="Currency" value={newType.currency} onChange={e => setNewType({ ...newType, currency: e.target.value })} required />
          <input className="border p-2 rounded" placeholder="Quantity" type="number" value={newType.quantityAvailable} onChange={e => setNewType({ ...newType, quantityAvailable: e.target.value })} required />
          <input className="col-span-2 border p-2 rounded" placeholder="Description" value={newType.description} onChange={e => setNewType({ ...newType, description: e.target.value })} />
          <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50" disabled={loading}>{loading ? 'Creating...' : 'Create Ticket Type'}</button>
          {/* <Button type="submit" className="col-span-2" disabled={loading}>{loading ? 'Creating...' : 'Create Ticket Type'}</Button> */}
        </form>
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Ticket Types</h3>
        <div className="overflow-x-auto">
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Currency</th>
                <th className="p-2 border">Available</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {ticketTypes.map(type => (
                <tr key={type.id || (type as any)._id} className="hover:bg-gray-50">
                  <td className="p-2 border font-semibold">{type.name}</td>
                  <td className="p-2 border">{type.price}</td>
                  <td className="p-2 border">{type.currency}</td>
                  <td className="p-2 border">{type.quantityAvailable}</td>
                  <td className="p-2 border">{type.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Sold Tickets</h3>
        <div className="overflow-x-auto">
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Ticket Number</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Attendee</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id || (ticket as any)._id} className="hover:bg-gray-50">
                  <td className="p-2 border font-mono">{ticket.ticketNumber}</td>
                  <td className="p-2 border">{(ticket.ticketType as any)?.name}</td>
                  <td className="p-2 border">{ticket.attendee.fullName}</td>
                  <td className="p-2 border">{ticket.attendee.email}</td>
                  <td className="p-2 border">{ticket.paymentStatus}</td>
                  <td className="p-2 border">{new Date(ticket.purchaseDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboardWithBoundary() {
  try {
    return <AdminDashboard />;
  } catch (err) {
    return <div className="text-red-600 p-4">Something went wrong. Please refresh the page.</div>;
  }
} 