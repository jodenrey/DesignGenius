import React from 'react';
import { useLoading, useOutput } from '@/store/useStore';
import useDownloader from "react-use-downloader";

const Download = () => {
  const { download } = useDownloader();
  const isLoading = useLoading((state: any) => state.isLoading);
  const isGenerating = useLoading((state: any) => state.isGenerating);
  const output = useOutput((state: any) => state.output);

  function fileName(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result + '.jpg';
  }

  return (
    <button 
      disabled={isGenerating || isLoading || !output}
      onClick={() => output && download(output, fileName(10))}
      className={`px-5 py-3 rounded-lg ${
        output && !isGenerating && !isLoading
          ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer'
          : 'bg-gray-500 cursor-not-allowed'
      }`}
    >
      {isGenerating || isLoading 
        ? 'Download Image' 
        : output 
          ? 'Download Image'
          : 'No Image Available'}
    </button>
  )
}

export default Download;