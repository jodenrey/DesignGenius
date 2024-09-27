'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [creditsUpdated, setCreditsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateUserCredits = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/update-credits`, {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        {creditsUpdated ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
            <p className="text-lg mb-6">Your credits have been updated.</p>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => window.location.href = '/dashboard'} // Redirect to a dashboard or home page
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Failed!</h1>
            <p className="text-lg mb-6">There was an issue updating your credits.</p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => window.location.href = '/pricing'} // Redirect to a retry page
            >
              Try Again
            </button>
          </>
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
