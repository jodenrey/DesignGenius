'use client'
import React from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

function CompareSlider() {
  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      borderRadius: '20px', // Adjust the value to your preference
      overflow: 'hidden' 
    }}>
      <ReactCompareSlider 
        itemOne={<ReactCompareSliderImage src='/1.png' alt="Before" />}
        itemTwo={<ReactCompareSliderImage src='/2.jpg' alt="After" />}    
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default CompareSlider
