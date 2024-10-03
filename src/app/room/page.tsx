"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // For programmatic navigation
import { motion } from "framer-motion";
import { Upload, CreditCard, Home, Palette } from "lucide-react";
import Download from "@/components/Download";
import GenerateBtn from "@/components/GenerateBtn";
import PreviewContent from "@/components/PreviewContent";
import SelectInp from "@/components/SelectInp";
import ThemeOptions from "@/components/ThemeOptions";
import UploadDnd from "@/components/UploadDnd";
import History from "@/components/History";

const Page = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const historyRef = useRef<{ fetchHistory: () => void } | null>(null);
  const { isLoaded, isSignedIn } = useAuth(); // Clerk's authentication state
  const router = useRouter();

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/get-credits");
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      } else {
        console.error("Failed to fetch credits:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  }, []);

  const handleHistoryUpdate = () => {
    if (historyRef.current) {
      historyRef.current.fetchHistory(); // Call the fetchHistory function exposed by the History component
    }
  };

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in"); // Redirect to Clerk's sign-in page if not logged in
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch credits after component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchCredits();
    }
  }, [fetchCredits, isSignedIn]);

 

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-8"
        >
          Redesign your{" "}
          <span className="bg-clip-text text-orange-500">room</span> in seconds
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="lg:w-1/3 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg"
            >
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <Upload className="mr-2" /> Upload a photo of your room
              </h3>
              <p className="text-gray-300 mb-4">
                Submit a JPEG or PNG photo that captures only a room or a sketch room for the best results.
              </p>
              <UploadDnd />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center">
                <CreditCard className="mr-2" />
                <span className="font-semibold">Your Credits:</span>
              </div>
              <span className="text-2xl font-bold text-orange-400">
                {credits ?? "..."}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg relative z-20"
            >
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <Home className="mr-2" /> Select Room Type
              </h3>
              <SelectInp />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg"
            >
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <Palette className="mr-2" /> Select Room Theme
              </h3>
              <ThemeOptions />
            </motion.div>

           

            <GenerateBtn
              onGenerateComplete={() => {
                fetchCredits();
                handleHistoryUpdate(); // Trigger the history update after generating a new image
              }}
            />
          </div>

          {/* Right Column */}
          <div className="lg:w-2/3 items-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg flex flex-col items-center text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Preview</h2>
              <PreviewContent />
              <div className="mt-4">
                <Download />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg flex flex-col"
            >
              <History ref={historyRef} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
