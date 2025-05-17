import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TicketPurchaseWithBoundary from './pages/TicketPurchase';
import AdminDashboardWithBoundary from './pages/AdminDashboard';
import PaymentResult from './pages/PaymentResult';
import './App.css'

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('Global error boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 p-4">A critical error occurred. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <Router>
      <nav className="flex gap-4 p-4 bg-gray-100">
        <Link to="/" className="text-blue-600 font-semibold">Buy Ticket</Link>
        <Link to="/admin" className="text-green-600 font-semibold">Admin</Link>
      </nav>
      <GlobalErrorBoundary>
        <Routes>
          <Route path="/" element={<TicketPurchaseWithBoundary />} />
          <Route path="/admin" element={<AdminDashboardWithBoundary />} />
          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
      </GlobalErrorBoundary>
    </Router>
  );
};

export default App;
