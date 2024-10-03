'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/solid';

const CancelPage = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id'); // Optional: If you want to log or perform any action with the session ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // You can perform any necessary cleanup or logging here if required
    setLoading(false);
  }, []);

  return (
    <div className='min-h-screen'>
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="spinner border-4 border-red-500 border-t-transparent rounded-full w-16 h-16 mb-4 animate-spin"></div>
          <p className="text-white">Canceling your payment, please wait...</p>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Canceled!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been canceled. If you have questions, please contact support.
          </p>
          <div className="flex flex-col gap-4"> {/* Add gap between buttons */}
  <button
    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
    onClick={() => window.location.href = '/room'} // Redirect to redesign room or main page
  >
    Return to Room Design
  </button>
  <button
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
    onClick={() => window.location.href = '/pricing'} // Redirect to pricing or retry payment
  >
    Try Again
  </button>
</div>
        </div>
      )}
    </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelPage />
    </Suspense>
  );
}
