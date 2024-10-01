'use client'
import React, { useEffect } from 'react';
import Image from 'next/image';
import joden from '@/assets/joden.png';
import joanna from '@/assets/joanna.png';
import jemimah from '@/assets/jemimah.jpg';
import adrian from '@/assets/adrian.png';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { FaLightbulb, FaPalette, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const teamMembers = [
    { name: "Reyes, Joseph Dennis", role: "Programmer", image: joden },
    { name: "Cayetano, Jemimah", role: "System Analyst", image: jemimah },
    { name: "Uy, Joanna Marie", role: "Quality Assurance", image: joanna },
    { name: "Dela Cruz, Mark Adrian", role: "Project Manager", image: adrian},
  ];

  const features = [
    { icon: FaLightbulb, title: "AI-Powered Personalization", description: "DesignGenius leverages advanced AI to deliver design solutions tailored to your unique preferences and space, ensuring a perfect fit for your lifestyle and aesthetic." },
    { icon: FaPalette, title: "User-Friendly Experience", description: "We prioritize simplicity and ease of use. Whether you are a homeowner or a professional designer, our intuitive platform makes it easy to create stunning interiors with just a few clicks." },
    { icon: FaLeaf, title: "Affordable and Accessible", description: "Professional-quality design should not be out of reach. DesignGenius brings high-end design capabilities to everyone, eliminating the need for expensive consultations or software." },
  ];

  return (
    <div className="min-h-screen">
      <div className="py-16 px-5 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-7xl w-full">
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h1 className="font-bold text-6xl text-gray-900 mb-4">About Us</h1>
            <p className="text-2xl text-[#C87616] mb-12">
              DESIGNGENIUS: A WEB-BASED AI INTERIOR DESIGN PARTNER WITH GENERATIVE DESIGN
            </p>

            <div className="flex justify-center gap-12 flex-wrap mt-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={member.name}
                  className="text-center w-48"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="rounded-full w-48 h-48 object-cover border-4 border-[#C87616] transition-all duration-300 hover:shadow-lg"
                    width={200}
                    height={200}
                  />
                  <h3 className="mt-4 text-lg font-semibold text-gray-800">{member.name}</h3>
                  <p className="mt-1 text-base text-gray-600">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <section className="my-16" data-aos="fade-up">
            <div className="text-left">
              <p className="text-sm text-orange-500 mb-2">| DesignGenius</p>
              <h2 className="font-bold text-4xl text-gray-900 mb-6">About the Developers</h2>
              <p className="text-lg leading-7 text-gray-700">
                We are Bachelor of Science in Computer Science students from STI, and DesignGenius represents the culmination of our thesis work. DesignGenius is an AI-powered platform created to assist users in transforming their interior spaces with ease and efficiency. Our website offers a range of AI-driven design solutions, from personalized room layouts to 3D visualizations, catering to homeowners, interior designers, and enthusiasts alike. Through this project, we have combined our passion for technology and design to create a user-friendly tool that makes the design process more accessible and innovative.
              </p>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-12 mt-16" data-aos="fade-up">
            <div className="md:w-1/2">
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src='/1.png' alt="Before" />}
                itemTwo={<ReactCompareSliderImage src='/2.jpg' alt="After" />}
                style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden' }}
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6 text-[#C87616]">Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To revolutionize interior design by harnessing the power of AI, making personalized, high-quality design
                accessible to everyone, and inspiring creativity that transforms living spaces into innovative, functional,
                and aesthetically pleasing environments.
              </p>
            </div>
          </div>

          <motion.div 
            className="mt-16 bg-gradient-to-r from-[#C87616] to-[#E9A254] p-8 rounded-xl shadow-lg text-white"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            data-aos="fade-up"
          >
            <h2 className="text-4xl font-bold mb-6">Mission</h2>
            <p className="text-lg leading-relaxed">
              To provide an AI-powered platform that delivers fast, personalized interior design solutions,
              enhancing user creativity and satisfaction while offering a seamless and intuitive
              experience. We aim to give users innovative tools, support professional designers, and
              create designs that are both sustainable and visually appealing.
            </p>
          </motion.div>

          <section className="mt-16 text-center" data-aos="fade-up">
            <h2 className="font-bold text-4xl text-gray-900 mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="bg-white p-8 shadow-lg rounded-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#C87616] p-4 rounded-full text-white">
                      <feature.icon className="text-4xl" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;