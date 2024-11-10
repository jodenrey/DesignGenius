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
        primary: "#CC5500",
        error: "#d23f4d",
        shade100: "#fff",
        shade200: "#fffe",
        shade300: "#fffd",
        shade400: "#fffc",
        shade500: "#fff9",
        shade600: "#fff7",
        shade700: "#fff2",
        shade800: "#fff1",
        shade900: "#ffff",
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

      if (userCredits < 1) {
        setIsModalOpen(true);
        return;
      }

      setPreview(imageUrl);
      setImageUrl(imageUrl);
    }
    fetchUserCredits();
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative w-full aspect-[2/1] min-h-[200px]">
        {preview ? (
          <div className="relative w-full h-full">
            {loading && (
              <div className="absolute inset-0 w-full h-full bg-slate-300 animate-pulse rounded-md" />
            )}
            <div className="relative w-full h-full">
              <Image
                className="object-contain rounded-md"
                src={preview}
                onLoad={() => setLoading(false)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                alt="preview"
              />
              <button
                className="absolute top-4 right-4 z-10 p-1 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors"
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
                  className="w-8 h-8 text-orange-500">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <UploadDropzone
              options={options}
              onUpdate={onUpdate}
              width="100%"
              height="100%"
            />
          </div>
        )}
      </div>
      
      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default UploadDnd;