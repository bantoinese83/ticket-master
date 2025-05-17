import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentResult: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get('status');

  const isSuccess = status === 'success';

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
      {/* Replace below with Shadcn Alert when available */}
      <div className={`mb-4 p-4 rounded ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> 
        <h2 className="text-2xl font-bold mb-2">{isSuccess ? 'Payment Successful!' : 'Payment Failed'}</h2>
        <p className="mb-2">
          {isSuccess
            ? 'Your payment was successful. Your ticket receipt will be sent to your email shortly.'
            : 'There was an issue with your payment. Please try again or contact support.'}
        </p>
      </div>
      <Link to="/">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Back to Home</button>
      </Link>
    </div>
  );
};

export default PaymentResult; 