'use client';

import { useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/solid'; // Heroicons for error icon

const CancelPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-10"> 
    <div className="p-20 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md text-center">
        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Canceled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment process has been canceled. 
        </p>
        <button
          onClick={() => router.push('/pricing')} // Redirect to pricing or retry page
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
        >
          Back to Pricing
        </button>
      </div>
    </div>
</div>
  );
};

export default CancelPage;
