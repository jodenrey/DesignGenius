'use client'
import React from 'react'
import { useLoading, useOutput } from '@/store/useStore';
import useDownloader from "react-use-downloader";

const Download = () => {

  const { download } = useDownloader();

  function fileName(length : number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result+'.jpg';
  }


  const isLoading = useLoading((state: any) => state.isLoading);
  const isGenerating = useLoading((state: any) => state.isGenerating);
  const output = useOutput((state: any) => state.output);

  return (
    <button 
      disabled={isGenerating && isLoading} 
      onClick={() => download(output, fileName(10) ) }
      className='bg-blue-500 px-5 py-3 text-white rounded-lg'
    >
      Download Image
    </button>
  )
}

export default Download
