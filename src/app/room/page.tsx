import Download from '@/components/Download'
import GenerateBtn from '@/components/GenerateBtn'
import PreviewContent from '@/components/PreviewContent'
import SelectInp from '@/components/SelectInp'
import ThemeOptions from '@/components/ThemeOptions'
import UploadDnd from '@/components/UploadDnd'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-screen container mx-auto py-10 '>
      <div className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-20 px-10">
        <div className="flex flex-col items-center gap-8 md:w-1/3">
          <div className="flex flex-col items-center gap-5 w-full">
            <h3 className="font-bold text-white text-xl">UPLOAD A PHOTO OF YOUR ROOM</h3>
            <p className= "text-white text-slate-400 text-lg text-center"> Submit a JPEG or PNG photo that captures only a room for the best results.   </p>
            {/* Upload Component */}
            <UploadDnd />
          </div>
          <div className="flex flex-col items-center gap-5 w-full">
            <h3 className="font-bold text-white text-xl">Select Room Type</h3>
            {/* Select Component */}
            <SelectInp />
          </div>
          <div className="flex flex-col items-center gap-5 w-full">
            <h3 className="font-bold text-white text-xl">Select Room Theme</h3>
            {/* Theme Option Component */}
            <ThemeOptions />
          </div>
          {/* Generate Button Components */}
          <GenerateBtn />
        </div>
        <div className='md:w-2/3 flex flex-col items-center pb-10'>
          <div className='md:flex hidden flex-col gap-5 text-center'>
            <h1 className='text-6xl text-white font-bold'>Redesign your  
              <span className='text-blue-500'> room</span> in seconds
            </h1>
            <p className='text-slate-400 text-xl'>Upload a room, specify the room type, and select your theme to design</p>
          </div>
          <div className='mt-5'>
            <Download />
          </div>
          {/* Preview Component */}
          <PreviewContent />
          
        </div>
      </div>
    </div>
  )
}

export default page