'use client';

import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { motion } from 'framer-motion';

const DesignExamples = () => {
  const examples = [
    {
      id: 1,
      before: '/1.png',
      after: '/2.jpg',
      title: 'Modern Living Room',
      description: 'A sleek, contemporary design with minimalist furniture.'
    },
    {
      id: 2,
      before: '/3.jpg',
      after: '/4.jpg',
      title: 'Cozy Bedroom',
      description: 'A warm and inviting bedroom transformation for comfort.'
    },
    {
      id: 3,
      before: '/5.jpg',
      after: '/6.jpg',
      title: 'Elegant Kitchen',
      description: 'A kitchen remodel with luxury materials and modern finishes.'
    },
    {
      id: 4,
      before: '/7.jpg',
      after: '/8.jpg',
      title: 'Chic Dining Room',
      description: 'A stylish dining area with contemporary art and decor.'
    },
    {
      id: 5,
      before: '/9.jpg',
      after: '/10.jpg',
      title: 'Vintage Workspace',
      description: 'A retro-inspired workspace for creativity and productivity.'
    },
    {
        id: 6,
        before: '/11.jpg',
        after: '/12.jpg',
        title: 'Luxurious Bathroom',
        description: 'A bathroom makeover with high-end finishes and spa-like features.'
      },
    {
      id: 7,
      before: '/13.jpg',
      after: '/14.jpg',
      title: 'Luxurious Bathroom',
      description: 'A bathroom makeover with high-end finishes and spa-like features.'
    },
    {
        id: 8,
        before: '/13.jpg',
        after: '/15.jpg',
        title: 'Luxurious Bathroom',
        description: 'A bathroom makeover with high-end finishes and spa-like features.'
      },
      {
        id: 9,
        before: '/16.jpg',
        after: '/17.jpg',
        title: 'Luxurious Bathroom',
        description: 'A bathroom makeover with high-end finishes and spa-like features.'
      },
      {
        id: 10,
        before: '/19.png',
        after: '/20.jpg',
        title: 'Luxurious Bathroom',
        description: 'A bathroom makeover with high-end finishes and spa-like features.'
      },

      {
        id: 11,
        before: '/21.jpg',
        after: '/22.jpg',
        title: 'Luxurious Bathroom',
        description: 'A bathroom makeover with high-end finishes and spa-like features.'
      },
      {
        id: 12,
        before: '/23.jpg',
        after: '/24.jpg',
        title: 'Luxurious Bathroom',
        description: 'A bathroom makeover with high-end finishes and spa-like features.'
      },

  ];

  return (
    <div className="py-16 px-5 flex justify-center items-center">
      <div className="bg-black rounded-3xl shadow-2xl p-10 max-w-7xl w-full">
      <h1 className="font-bold text-6xl text-orange-500 mb-4 text-center">Example Designs</h1>
            <p className="text-2xl text-white text-center mb-12">
              DESIGNGENIUS: A WEB-BASED AI INTERIOR DESIGN PARTNER WITH GENERATIVE DESIGN
            </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {examples.map((example) => (
            <motion.div
              key={example.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-white">{example.title}</h3>
                <p className="text-gray-300">{example.description}</p>
                <div className="w-full h-64 relative">
                  <ReactCompareSlider
                    itemOne={
                      <ReactCompareSliderImage
                        src={example.before}
                        alt="Before"
                        className="object-cover w-full h-full"
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={example.after}
                        alt="After"
                        className="object-cover w-full h-full"
                      />
                    }
                    className="rounded-lg shadow-md w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DesignExamples;