'use client';
import { useImage, useLoading, useOutput, useRoom, useTheme } from '@/store/useStore';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import SubscriptionModal from "./SubscriptionPopup";

const GenerateBtn = ({ onGenerateComplete }: { onGenerateComplete: () => void }) => {
  const imageUrl = useImage((state: any) => state.imageUrl);
  const theme = useTheme((state: any) => state.theme);
  const room = useRoom((state: any) => state.room);
  const setOutput = useOutput((state: any) => state.setOutput);
  const setLoading = useLoading((state: any) => state.setLoading);
  const setGenerating = useLoading((state: any) => state.setGenerating);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false); // To prevent multiple clicks

  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchUserCredits = async () => {
      if (isSignedIn && userId) {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setUserCredits(user.credits || 0);
        } else {
          console.error('Failed to fetch user credits:', response.statusText);
        }
      }
    };

    fetchUserCredits();
  }, [isSignedIn, userId]);

  async function handleClick() {
    if (isProcessing || userCredits < 1) return; // Prevent clicks if processing or credits are insufficient
    setIsProcessing(true); // Disable button during processing

    if (imageUrl && theme) {
      setLoading(true);
      setGenerating(true);

      try {
        // Step 1: Fetch the /api/dream endpoint
        const dreamResponse = await fetch('/api/dream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            theme,
            room,
            imageUrl,
          }),
        });

        if (!dreamResponse.ok) {
          console.error('Error fetching dream:', dreamResponse.statusText);
          setLoading(false);
          setGenerating(false);
          return;
        }

        const newPhoto = await dreamResponse.json();
        setOutput(newPhoto[1]);

        // Step 2: Deduct user credits
        const deductResponse = await fetch(`/api/user/${userId}/deduct-credits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: 1 }), // Deduct 1 credit
        });

        if (deductResponse.ok) {
          const updatedUser = await deductResponse.json();
          setUserCredits(updatedUser.credits); // Update user credits from the response

          // Step 3: Notify parent component
          onGenerateComplete(); // Notify parent to refresh credits in real-time
        } else {
          console.error('Failed to deduct credits:', deductResponse.statusText);
        }
      } catch (error) {
        console.error('Error while fetching:', error);
      } finally {
        setLoading(false);
        setGenerating(false);
        setIsProcessing(false); // Re-enable button after process completes
      }
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isProcessing || userCredits < 1} // Disable button based on processing and credits
        className={`${
          imageUrl && theme ? '' : 'cursor-not-allowed'
        } p-5 w-full bg-orange-700 text-white rounded-lg hover:opacity-90 active:scale-[.98] transition ${
          isProcessing ? 'opacity-50' : ''
        }`}
      >
        {isProcessing ? 'Processing...' : 'Generate Room'}
      </button>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default GenerateBtn;
