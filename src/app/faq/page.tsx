import FAQAccordion from '@/components/FAQAccordion';
import React from 'react';

const FAQPage = () => {
  return (
    <div className="min-h-screen p-10"> {/* Background color for the entire page */}
      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl mx-auto"> {/* Background color for the FAQ section */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h1>
        <FAQAccordion />
      </div>
    </div>
  );
};

export default FAQPage;
