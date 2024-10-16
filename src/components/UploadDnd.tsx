"use client";
import React, { useState, useEffect } from "react";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import Image from "next/image";
import { useImage } from "@/store/useStore";
import { UploadWidgetConfig } from "@bytescale/upload-widget";
import { useAuth } from "@clerk/nextjs";
import SubscriptionModal from "./SubscriptionPopup";

function UploadDnd() {
  const [preview, setPreview] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const setImageUrl = useImage((state: any) => state.setImageUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userCredits, setUserCredits] = useState<number>(0);
  
  const { userId, isSignedIn } = useAuth();

  const options: UploadWidgetConfig = {
    apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
        ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
        : "free",
    maxFileCount: 1,
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
      "image/avif",
      "image/heic",
      "image/tiff",
      "image/bmp",
    ],
    editor: { images: { crop: false } },
    styles: {
      colors: {
        primary: "#CC5500", // Primary buttons & links
        error: "#d23f4d", // Error messages
        shade100: "#fff", // Standard text
        shade200: "#fffe", // Secondary button text
        shade300: "#fffd", // Secondary button text (hover)
        shade400: "#fffc", // Welcome text
        shade500: "#fff9", // Modal close button
        shade600: "#fff7", // Border
        shade700: "#fff2", // Progress indicator background
        shade800: "#fff1", // File item background
        shade900: "#ffff", // Various (draggable crop buttons, etc.)
      },
    },
  };

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

  useEffect(() => {
    fetchUserCredits();
  }, [isSignedIn, userId]);

  function onUpdate({ uploadedFiles }: any) {
    if (uploadedFiles.length !== 0) {
      const imageUrl = uploadedFiles[0].fileUrl;
    

      // Show popup if user has no credits
      if (userCredits < 1) {
        setIsModalOpen(true);
        return;
      }

      setPreview(imageUrl);
      setImageUrl(imageUrl);
    }
    // Fetch updated user credits after upload attempt
    fetchUserCredits();
  }

  return (
    <>
      {preview ? (
        <div className="relative max-w-[500px] max-h-[300px] flex items-center justify-center">
          {loading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-slate-300 animate-pulse"></div>
          )}
          <Image
            className="object-cover rounded-md"
            src={preview}
            onLoad={() => setLoading(false)}
            width={400}
            height={200}
            alt="preview"
          />
          <button
            className="absolute top-4 right-4 z-10 backdrop-blur-md rounded-full"
            onClick={() => {
              setPreview("");
              setLoading(true);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-orange-500">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      ) : (
        <UploadDropzone
          options={options}
          onUpdate={onUpdate}
          width="400px"
          height="200px"
        />
      )}
      
      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default UploadDnd;
