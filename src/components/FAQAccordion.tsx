"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is DesignGenius?',
      answer: 'DesignGenius is an innovative web-based platform that serves as an AI-powered interior design partner, leveraging the capabilities of generative design. DesignGenius revolves around revolutionizing the interior design process by integrating artificial intelligence into the creative aspects. This platform acts as a virtual design assistant, providing users with intelligent and creative suggestions for their interior spaces',
    },
    {
      question: 'How do I get started?',
      answer: 'To get started, simply login or sign up for an account, and upload your room photo and wait for our AI to generate your dream room.',
    },
    {
      question: 'What will you do with my photos?',
      answer: 'Absolutely nothing, the images you upload and the images that are generated from our AI',
    },
    {
        question: 'How much will the AI Interior design look like my current interior?',
        answer: 'The resemblance depends on the quality of photo you upload. The better your photos, the more accurately the AI can understand and represent your unique characteristics.',
      },
      {
        question: 'Is DesignGenius for everyone?',
        answer: 'DesignGenius is built for interior designers, architects, and professionals in the property and real estate sector. However, everyone can easily use DesignGenius.',
      },
      {
        question: 'Why can’t I upload the image?',
        answer: 'Make sure it is JPG and PNG file type only.',
      },    
  ];

  return (
    <div className="max-w-4xl mx-auto my-12">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border-b border-gray-300 py-6 cursor-pointer transition-colors duration-300 ease-in-out ${activeIndex === index ? 'bg-gray-200' : 'hover:bg-orange-100'}`}
          onClick={() => toggleAccordion(index)}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-900">{faq.question}</h4>
            <span className="text-gray-600 text-xl">
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mt-4 text-gray-700 text-lg">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
