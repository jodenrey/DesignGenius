'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import logo from "@/assets/white.svg";
import { useLoading, useOutput, useImage } from '@/store/useStore';
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';
import { ScanOverlay } from './ScanOverlay'; // <-- import the overlay component


const PreviewContent = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const isLoading = useLoading((state: any) => state.isLoading);
  const isGenerating = useLoading((state: any) => state.isGenerating);
  const output = useOutput((state: any) => state.output);
  const imageUrl = useImage((state: any) => state.imageUrl);

  return (
    <div className="mt-8 flex flex-col items-center">
      {isLoading ? (
        <div className={`
          md:w-[500px] w-[350px] h-[200px] my-auto md:h-[300px] 
          bg-gradient-to-r from-slate-600 to-slate-700 
          rounded-lg shadow-lg 
          flex flex-col items-center justify-center 
          transition-all duration-300 ease-in-out
          ${isGenerating ? "animate-shimmer" : ""} 
        `}>
          <div className={`
            relative w-24 h-24 mb-4
            ${isGenerating ? "animate-bounce" : ""} 
          `}>
            <Image 
              fill
              src={logo} 
              alt="Logo" 
              className="object-contain"
            />
          </div>
          {isGenerating && (
            <div className="text-white text-center px-4">
              <p className="text-lg font-semibold mb-2 animate-fade-in">
                Generating...
              </p>
              <p className="text-sm opacity-80 animate-fade-in-delay">
                This may take up to 45 seconds. Thank you for your patience!
              </p>
            </div>
          )}
          {isGenerating && (
            <div className="mt-4 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping animation-delay-200"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping animation-delay-400"></div>
            </div>
          )}
        </div>
      ) : (
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage src={imageUrl} alt="Uploaded Image" />
          }
          itemTwo={
            <div className="relative w-full h-full">
              <ReactCompareSliderImage src={output} alt="AI Generated Image" />
              <button
                type="button"
                className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setShowOverlay(true)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          }
          onlyHandleDraggable={true}
          handle={
            <ReactCompareSliderHandle
              buttonStyle={{
                backdropFilter: 'none',
                background: 'white',
                border: 0,
                color: '#333',
                boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.15)'
              }}
              linesStyle={{
                width: 2,
                color: '#333'
              }}
            />
          }
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '800px',
            maxHeight: '600px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        />
      )}
            {/* Overlay Component for scanning */}
            <ScanOverlay
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        imageSrc={output}
      />
    </div>
  );
}

export default PreviewContent;
