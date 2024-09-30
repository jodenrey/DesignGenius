import FAQAccordion from '@/components/FAQAccordion';
import React from 'react';

const FAQPage = () => {
  return (
    <div className="min-h-screen p-10"> {/* Background color for the entire page */}
      <div className="bg-black rounded-3xl shadow-lg p-10 max-w-7xl  mx-auto"> {/* Background color for the FAQ section */}
        <h1 className="text-5xl font-extrabold text-center mb-6 text-orange-500">Frequently Asked Questions</h1>
        <FAQAccordion />
      </div>
    </div>
  );
};

export default FAQPage;
