'use client';
import React from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe using the public key from your environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Update props to accept a close function
interface SubscriptionPopupProps {
  onClose: () => void; // Function to handle closing the popup
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ onClose }) => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleChoosePlan = async (credits: number) => {
    if (!isSignedIn) {
      // If not signed in, redirect to sign-in page
      router.push('/sign-in?redirect_url=' + window.location.href);
      return;
    }

    // If signed in, create a checkout session
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits }),
      });

      const { sessionId } = await res.json();

      if (sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            console.error('Stripe checkout error:', error);
          }
        }
      } else {
        console.error('Error creating checkout session');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#131212] p-10 rounded-2xl max-w-4xl mx-auto w-full md:w-[800px] h-auto text-white relative">
        {/* Exit button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
        >
          &times; {/* Close icon */}
        </button>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">
            Unlock Exclusive AI-Driven Interior Design Plans
          </h2>
          <p className="text-lg text-gray-300">
            Subscribe to our AI-powered design service and get personalized interior design solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold mb-4">Basic Plan</h3>
            <p className="text-3xl font-bold mb-2">₱1000 / 30 Credits</p>
            <p className="text-gray-400 mb-6">30 room redesigns</p>
            <p className="text-gray-400 mb-6">Every design available</p>
            <button
              className="w-full py-3 bg-[#C87616] rounded-lg text-white font-semibold hover:bg-[#B0650F] transition"
              onClick={() => handleChoosePlan(30)}
            >
              Choose Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-[#C87616] transform hover:scale-105 transition duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold mb-4">Premium Plan</h3>
            <p className="text-3xl font-bold mb-2">₱2000 / 100 Credits</p>
            <p className="text-gray-400 mb-6">100 room redesigns</p>
            <p className="text-gray-400 mb-6">Every design available</p>
            <button
              className="w-full py-3 bg-[#C87616] rounded-lg text-white font-semibold hover:bg-[#B0650F] transition"
              onClick={() => handleChoosePlan(100)}
            >
              Choose Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold mb-4">Pro Plan</h3>
            <p className="text-3xl font-bold mb-2">₱3500 / 200 Credits</p>
            <p className="text-gray-400 mb-6">200 room redesigns</p>
            <p className="text-gray-400 mb-6">Every design available</p>
            <button
              className="w-full py-3 bg-[#C87616] rounded-lg text-white font-semibold hover:bg-[#B0650F] transition"
              onClick={() => handleChoosePlan(200)}
            >
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
