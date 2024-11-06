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
        answer: 'Make sure it is an image file type and you have enough credits. We accept all Image Extension.',
      },    
      {
        question: 'What security measures are in place to ensure the security of transactions?',
        answer: 'Our platform uses Stripe, a highly secure payment processing service, to handle all transactions. Stripe employs advanced encryption protocols, such as AES-256, to safeguard payment information and complies with PCI-DSS Level 1, the highest level of certification in the payment industry. This means your financial information is always encrypted and protected from unauthorized access. Additionally, Stripe monitors transactions for suspicious activity, providing an extra layer of security for every payment made on our platform.',
      },   
      {
        question: 'What security measures are in place for user data?',
        answer: 'We prioritize the security and privacy of user data by using Clerk, a robust authentication and identity management service. Clerk provides secure authentication by encrypting user credentials, supporting multi-factor authentication (MFA), and adhering to best practices for data protection. This ensures that user accounts are safeguarded against unauthorized access, protecting personal information at every step.'
      },   
  ];

  return (
    <div className="max-w-full mx-auto my-12 text-white">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border-b border-gray-300 py-6 cursor-pointer transition-colors duration-300 ease-in-out `}
          onClick={() => toggleAccordion(index)}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{faq.question}</h4>
            <span className="text-xl">
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
                <p className="mt-4 text-lg">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
