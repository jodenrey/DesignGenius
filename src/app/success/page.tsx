'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [creditsUpdated, setCreditsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateUserCredits = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/update-credit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: session_id }),
        });

        if (res.ok) {
          setCreditsUpdated(true);
        } else {
          console.error('Failed to update credits');
        }
      } catch (error) {
        console.error('Error updating credits:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session_id) {
      updateUserCredits();
    }
  }, [session_id]);

  return (
    <div className='min-h-screen'>
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="spinner border-4 border-green-500 border-t-transparent rounded-full w-16 h-16 mb-4 animate-spin"></div>
          <p className="text-white">Updating your credits, please wait...</p>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md text-center">
          {creditsUpdated ? (
            <>
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your payment. Your credits have been successfully updated!
              </p>
              <button
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
                onClick={() => window.location.href = '/room'}
              >
                Redesign your room!
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Failed!</h1>
              <p className="text-gray-600 mb-6">There was an issue updating your credits.</p>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => window.location.href = '/pricing'}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPage />
    </Suspense>
  );
}
