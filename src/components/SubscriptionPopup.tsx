import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { X, Check } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

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

  const plans = [
    { name: 'Basic', credits: 30, price: 1000, popular: false },
    { name: 'Premium', credits: 100, price: 2000, popular: true },
    { name: 'Pro', credits: 200, price: 3500, popular: false },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-600 text-center mb-6"
                >
                  Unlock AI-Powered Interior Design

                </Dialog.Title>
                <p className="text-xl text-center mb-8"> Transform your spaces with our cutting-edge AI design service. Buy credits that fits your vision and bring your dream interiors to life.</p>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`bg-white p-8 rounded-xl shadow-lg border-2 transform hover:scale-105 transition duration-300 ease-in-out ${
                        plan.popular ? 'border-orange-500' : 'border-gray-200'
                      } relative overflow-hidden transition-all duration-300 hover:shadow-xl`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                          Recommended
                        </div>
                      )}
                      <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                      <p className="text-4xl font-bold mb-6">₱{plan.price}</p>
                      <p className="text-gray-600 mb-6">{plan.credits} Credits</p>
                      <ul className="text-sm text-gray-600 mb-8">
                        <li className="flex items-center mb-3">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          {plan.credits} room redesigns
                        </li>
                        <li className="flex items-center mb-3">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          Every design available
                        </li>
                        
                      </ul>
                      <button
                        className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                          plan.popular
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-gray-800 hover:bg-gray-900'
                        }`}
                        onClick={() => handleChoosePlan(plan.credits)}
                      >
                        Buy Credits
                      </button>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SubscriptionModal