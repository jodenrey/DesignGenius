// src/components/CreditsDisplay.tsx
'use client'; // Indicate this is a client component
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs'; // Import Clerk's useAuth for authentication
import { prisma } from "@/lib/prisma"; // Import Prisma client

const CreditsDisplay: React.FC = () => {
  const { userId } = useAuth(); // Get userId from Clerk
  const [credits, setCredits] = useState<number | null>(null); // State to hold credits

  useEffect(() => {
    const fetchCredits = async () => {
      if (userId) {
        try {
          // Fetch user data from the database, including credits
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }, // Select only credits
          });

          if (user) {
            setCredits(user.credits); // Update state with user credits
          }
        } catch (error) {
          console.error('Error fetching credits:', error); // Handle errors
        }
      }
    };

    fetchCredits(); // Call the function to fetch credits
  }, [userId]); // Dependency array, fetch credits when userId changes

  return (
    <span className="text-white md:text-lg font-medium">
      Credits: {credits !== null ? credits : 'Loading...'} {/* Display credits or loading text */}
    </span>
  );
};

export default CreditsDisplay; // Export the component
