'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only mark the component as mounted when the client is ready
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateUserCredits = async () => {
      if (!session_id) return;

      const res = await fetch(`/api/update-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: session_id }),
      });

      if (res.ok) {
        console.log('Credits updated successfully');
      } else {
        console.error('Failed to update credits');
      }
    };

    if (isMounted && session_id) {
      updateUserCredits();
    }
  }, [isMounted, session_id]);

  return (
    <div className="min-h-screen p-10"> 
    <div className="p-20 flex items-center justify-center">
      <div className="bg-gray-100 p-10 rounded-xl shadow-lg max-w-md text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your credits have been successfully updated!
        </p>
        <button
          onClick={() => router.push('/room')} // Redirect to dashboard or account page
          className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition duration-300"
        >
          Redesign your room now!
        </button>
      </div>
    </div>
    </div>
  );
};

export default SuccessPage;
