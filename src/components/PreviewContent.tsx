'use client';
import Image from 'next/image';
import React from 'react';
import logo from "@/assets/white.svg";
import { useLoading, useOutput, useImage } from '@/store/useStore';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

const PreviewContent = () => {
  const isLoading = useLoading((state: any) => state.isLoading);
  const isGenerating = useLoading((state: any) => state.isGenerating);
  const output = useOutput((state: any) => state.output);
  const imageUrl = useImage((state: any) => state.imageUrl);

  return (
    <div className="mt-8">
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
                This may take up to 30 seconds. Thank you for your patience!
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
          itemOne={<ReactCompareSliderImage src={imageUrl} alt="Uploaded Image" />}
          itemTwo={<ReactCompareSliderImage src={output} alt="AI Generated Image" />}
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
    </div>
  );
}

export default PreviewContent;