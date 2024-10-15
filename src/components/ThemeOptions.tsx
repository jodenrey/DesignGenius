'use client'
import React from 'react'
import coastal from "@/assets/coastal.png";
import modern from "@/assets/modern.png";
import professional from "@/assets/professional.png";
import tribal from "@/assets/tribal.png";
import tropical from "@/assets/tropical.png";
import vintage from "@/assets/vintage.png";
import industrial from "@/assets/industrial.jpg";
import neoclassic from "@/assets/neoclassic.jpg";
import summer from "@/assets/summer.jpg";
import Image from 'next/image';
import { useTheme } from '@/store/useStore';

const ThemeOptions = () => {

  const setTheme=useTheme((state:any)=>state.setTheme)

  const themes = [
    {value : "minimalist" , imgUrl : coastal},
    {value : "modern" , imgUrl : modern},
    {value : "professional" , imgUrl : professional},
    {value : "contemporary" , imgUrl : tribal},
    {value : "mediterranean" , imgUrl : tropical},
    {value : "vintage" , imgUrl : vintage},
    {value : "industrial" , imgUrl : industrial},
    {value : "neoclassic" , imgUrl : neoclassic},
    {value : "scandinavian" , imgUrl : summer},

  ]

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    document.querySelector(".selected")?.classList.remove("selected");
    e.currentTarget.classList.add("selected")
    setTheme(e.currentTarget.lastChild?.textContent);
  }

  return (
    <div className='grid grid-cols-3 gap-5'>
      {
        themes.map((theme,index) => (
          <div onClick={handleClick} key={index} className='cursor-pointer transition-all flex flex-col items-center gap-2 group'>
            <Image src={theme.imgUrl} alt='theme' className='rounded-lg group-hover:opacity-80' />
            <p className='font-semibold text-white'>{theme.value}</p>
          </div>
        ))
      }
    </div>
  )
}

export default ThemeOptions
