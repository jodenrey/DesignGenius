import React from 'react';
import { useRouter } from 'next/router';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { status } = router.query;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {status === 'success' ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-500 mb-4">Payment Successful!</h1>
          <p className="text-lg">Thank you for your purchase. Your credits have been added to your account.</p>
          <button className="mt-8 py-2 px-6 bg-blue-600 text-white rounded-lg" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Failed</h1>
          <p className="text-lg">Unfortunately, your payment could not be processed. Please try again.</p>
          <button className="mt-8 py-2 px-6 bg-blue-600 text-white rounded-lg" onClick={() => router.push('/pricing')}>
            Go Back to Pricing
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
