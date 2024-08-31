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
      answer: 'DesignGenius is a platform that offers a wide range of design resources and tools to help designers bring their ideas to life.',
    },
    {
      question: 'How do I get started?',
      answer: 'To get started, simply sign up for an account, explore our resources, and start designing. We offer tutorials and guides to help you every step of the way.',
    },
    {
      question: 'What resources are available?',
      answer: 'We offer a variety of resources including templates, tutorials, design tools, and a community forum to help you improve your design skills.',
    },
    {
        question: 'What resources are available?',
        answer: 'We offer a variety of resources including templates, tutorials, design tools, and a community forum to help you improve your design skills.',
      },
      {
        question: 'What resources are available?',
        answer: 'We offer a variety of resources including templates, tutorials, design tools, and a community forum to help you improve your design skills.',
      },
      {
        question: 'What resources are available?',
        answer: 'We offer a variety of resources including templates, tutorials, design tools, and a community forum to help you improve your design skills.',
      },    
  ];

  return (
    <div className="max-w-4xl mx-auto my-12">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border-b border-gray-300 py-6 cursor-pointer transition-colors duration-300 ease-in-out ${activeIndex === index ? 'bg-gray-200' : 'hover:bg-orange-200'}`}
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
