'use client'
import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Check } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  name: string;
  credits: number;
  price: number;
  features: string[];
}

const PricingPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const plans: Plan[] = [
    { name: 'Basic', credits: 30, price: 1000, features: ['30 room redesigns', 'Every design available'] },
    { name: 'Premium', credits: 100, price: 2000, features: ['100 room redesigns', 'Every design available'] },
    { name: 'Pro', credits: 200, price: 3500, features: ['200 room redesigns', 'Every design available'] },
  ];

  const handleChoosePlan = async (credits: number) => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect_url=' + window.location.href);
      return;
    }

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits }),
      });

      const { sessionId } = await res.json();

      if (sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) console.error('Stripe checkout error:', error);
        }
      } else {
        console.error('Error creating checkout session');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <section className="rounded-3xl max-w-7xl mx-auto bg-black 800 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-600">
          Unlock AI-Powered Interior Design
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Transform your spaces with our cutting-edge AI design service. Buy credits that fits your vision and bring your dream interiors to life.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={plan.name}
            className={`bg-gray-900 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out ${
              plan.name === 'Premium' ? 'border-2 border-orange-500 relative overflow-hidden' : ''
            }`}
          >
            {plan.name === 'Premium' && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg font-semibold">
                Best Value
              </div>
            )}
            <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
            <p className="text-4xl font-bold mb-2">₱{plan.price.toLocaleString()}</p>
            <p className="text-gray-400 mb-6">{plan.credits} Credits</p>
            <ul className="text-left mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center mb-2">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                selectedPlan === index
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => {
                setSelectedPlan(index);
                handleChoosePlan(plan.credits);
              }}
            >
              {selectedPlan === index ? 'Selected. Please Wait..' : 'Buy Credits'}
            </button>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PricingPage;