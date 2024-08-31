'use client';
import Image from 'next/image';
import React from 'react';
import logo from "@/assets/logo.svg";
import { useLoading, useOutput, useImage } from '@/store/useStore';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

const PreviewContent = () => {
    const isLoading = useLoading((state: any) => state.isLoading);
    const isGenerating = useLoading((state: any) => state.isGenerating);
    const output = useOutput((state: any) => state.output);
    const imageUrl = useImage((state: any) => state.imageUrl);

    return (
        isLoading ? (
          <div
          className={`${
              isGenerating && "animate-pulse"
          } md:w-[500px] w-[350px] h-[200px] my-auto md:h-[300px] bg-slate-500 rounded-lg flex items-center justify-center mt-8`}>
          <Image width={100} height={100} src={logo} alt="couch" />
      </div>
        ) : (
            <div className="mt-8">
                <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={imageUrl} alt="Uploaded Image" />}
                    itemTwo={<ReactCompareSliderImage src={output} alt="AI Generated Image" />}
                    style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', borderRadius: '8px' }}
                />
            </div>
        )
    );
}

export default PreviewContent;
