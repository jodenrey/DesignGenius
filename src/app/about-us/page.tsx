'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import joden from '@/assets/joden.png';
import joanna from '@/assets/joanna.png';
import jemimah from '@/assets/jemimah.jpg';
import adrian from '@/assets/adrian.png';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { FaLightbulb, FaPalette, FaLeaf, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import toast, { Toaster } from 'react-hot-toast';


const AboutPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  
  const formAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Prepare form data
    const formData = {
      name,
      email,
      message,
    };
  
   
   // Regular expression for validating email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   // Check if email is valid
   if (!emailRegex.test(email)) {
     toast.error('Please enter a valid email address.', {
       icon: '❌',
       style: {
         borderRadius: '10px',
         background: '#333',
         color: '#fff',
       },
     });
     return; // Stop further execution
   }
 
   try {
     const response = await fetch('/api/contact', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(formData),
     });
 
     if (response.ok) {
       toast.success(' Message sent successfully!', {
         icon: '🚀',
         style: {
           borderRadius: '10px',
           background: '#333',
           color: '#fff',
           fontWeight: 'bold', // Make the text bold
           fontSize: '16px', // Increase font size for better readability
           padding: '10px 15px', // Add some padding
           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Add a subtle shadow for dept
         },
       });
 
       setName('');
       setEmail('');
       setMessage('');
     } else {
       const errorData = await response.json();
       toast.error('Error sending message. Please try again.', {
         icon: '❌',
         style: {
           borderRadius: '10px',
           background: '#333',
           color: '#fff',
         },
       });
     }
   } catch (error) {
     toast.error('Error sending message. Please try again.', {
       icon: '❌',
       style: {
         borderRadius: '10px',
         background: '#333',
         color: '#fff',
       },
     });
   }
 };
  const teamMembers = [
    { name: "Reyes, Joseph Dennis", role: "Programmer", image: joden },
    { name: "Cayetano, Jemimah", role: "System Analyst", image: jemimah },
    { name: "Uy, Joanna Marie", role: "Quality Assurance", image: joanna },
    { name: "Dela Cruz, Adrian", role: "Project Manager", image: adrian},
  ];

  const features = [
    { icon: FaLightbulb, title: "AI-Powered Personalization", description: "DesignGenius leverages advanced AI to deliver design solutions tailored to your unique preferences and space, ensuring a perfect fit for your lifestyle and aesthetic." },
    { icon: FaPalette, title: "User-Friendly Experience", description: "We prioritize simplicity and ease of use. Whether you are a homeowner or a professional designer, our intuitive platform makes it easy to create stunning interiors with just a few clicks." },
    { icon: FaLeaf, title: "Affordable and Accessible", description: "Professional-quality design should not be out of reach. DesignGenius brings high-end design capabilities to everyone, eliminating the need for expensive consultations or software." },
  ];

  return (
    <div className="min-h-screen">
      <div className="py-16 px-5 flex justify-center items-center">
        <div className="bg-black rounded-3xl shadow-2xl p-10 max-w-7xl w-full">
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
           <h1 className="font-bold text-6xl text-orange-500 mb-4">About Us</h1>
            <p className="text-2xl text-white  mb-12">
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
                  <h3 className="mt-4 text-lg font-semibold text-white">{member.name}</h3>
                  <p className="mt-1 text-base text-white">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <section className="my-16" data-aos="fade-up">
            <div className="text-left">
              <p className="text-sm text-orange-500 mb-2">| DesignGenius</p>
              <h2 className="font-bold text-4xl text-white mb-6">About the Developers</h2>
              <p className="text-lg leading-7 text-white">
                We are Bachelor of Science in Computer Science students from STI College San Jose Del Monte. DesignGenius is an AI-powered platform created to assist users in transforming their interior spaces with ease and efficiency. Our website offers a range of AI-driven design solutions, from personalized room layouts to 3D visualizations, catering to homeowners, interior designers, and enthusiasts alike. Through this project, we have combined our passion for technology and design to create a user-friendly tool that makes the design process more accessible and innovative.
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
              <p className="text-lg text-white leading-relaxed">
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
            <h2 className="font-bold text-4xl text-white mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <motion.div   
                  key={feature.title}
                  className="bg-gray-900 p-8 shadow-lg rounded-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#C87616] p-4 rounded-full text-white">
                      <feature.icon className="text-4xl" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl text-white mb-4">{feature.title}</h3>
                  <p className="text-white">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>


       {/* New Contact Section */}
       <section className="mt-20 text-center" data-aos="fade-up">
        <h2 className="font-bold text-4xl text-white mb-12">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={formAnimation}
            >
              <motion.div variants={itemAnimation}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C87616] transition-all duration-300 hover:bg-gray-700"
                  required
                />
              </motion.div>
              <motion.div variants={itemAnimation}>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C87616] transition-all duration-300 hover:bg-gray-700"
                  required
                />
              </motion.div>
              <motion.div variants={itemAnimation}>
                <textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C87616] h-32 resize-none transition-all duration-300 hover:bg-gray-700"
                  required
                ></textarea>
              </motion.div>
              <motion.button
                type="submit"
                className="bg-[#C87616] text-white py-3 px-6 rounded-md hover:bg-[#E9A254] transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemAnimation}
              >
                Send Message
                
              </motion.button>
              <Toaster position="top-center" reverseOrder={false} />

            </motion.form>
          </div>
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col justify-between">
    <div className="space-y-6 mb-6">
  <motion.div
    className="flex items-center space-x-4"
    whileHover={{ scale: 1.05 }}
  >
    <FaEnvelope className="text-xl sm:text-2xl text-[#C87616]" />
    <span className="text-sm sm:text-base md:text-lg text-white">designgeniusonline@gmail.com</span>
  </motion.div>
  
  <motion.div
    className="flex items-center space-x-4"
    whileHover={{ scale: 1.05 }}
  >
    <FaPhone className="text-xl sm:text-2xl text-[#C87616]" />
    <span className="text-sm sm:text-base md:text-lg text-white">+63 9123456789</span>
  </motion.div>
  
  <motion.div
    className="flex items-start space-x-4"
    whileHover={{ scale: 1.05 }}
  >
    <FaMapMarkerAlt className="text-xl sm:text-2xl text-[#C87616] mt-1" />
    <span className="text-sm sm:text-base md:text-lg text-white text-left">
      STI Academic Center, Quirino Highway, Tungkong Mangga, San Jose Del Monte City, 3023 Bulacan
    </span>
  </motion.div>
</div>

      <div className="w-full h-64 rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.826030818503!2d121.07189187592844!3d14.778827072686695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397af51766d26a3%3A0x30d0764cb84cc80!2sSTI%20Academic%20Center%20San%20Jose%20Del%20Monte!5e0!3m2!1sen!2sph!4v1728659744109!5m2!1sen!2sph"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;