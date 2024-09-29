import Image from 'next/image';
import joseph from '@/assets/joseph.png'
import johndoe from '@/assets/johndoe.png'

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <div className="py-12 px-5 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-full">
          <section className="mb-12 text-center">
            <h1 className="font-bold text-4xl">About Us</h1>
            <p className="text-xl text-[#C87616] mt-2 mb-8">
              DESIGNGENIUS: A WEB-BASED AI INTERIOR DESIGN PARTNER WITH GENERATIVE DESIGN
            </p>
            
            <div className="flex justify-center gap-12 flex-wrap mt-8">
              {/* Team members */}
              <div className="text-center w-44">
                <Image
                  src={johndoe}
                  alt="Joseph Reyes"
                  className="rounded-full w-50 h-50 object-cover border-4 border-[#C87616]"
                  width={200}
                  height={200}
                />
                <h3 className="mt-4 text-lg font-semibold">Reyes, Joseph Dennis</h3>
                <p className="mt-1 text-base text-gray-600">Programmer</p>
              </div>
              <div className="text-center w-44">
                <Image
                  src={johndoe}
                  alt="Jemimah Cayetano"
                  className="rounded-full w-50 h-50 object-cover border-4 border-[#C87616]"
                  width={200}
                  height={200}
                />
                <h3 className="mt-4 text-lg font-semibold">Cayetano, Jemimah</h3>
                <p className="mt-1 text-base text-gray-600">System Analyst</p>
              </div>
              <div className="text-center w-44">
                <Image
                  src={johndoe}
                  alt="Joanna Uy"
                  className="rounded-full w-50 h-50 object-cover border-4 border-[#C87616]"
                  width={200}
                  height={200}
                />
                <h3 className="mt-4 text-lg font-semibold">Uy, Joanna Marie</h3>
                <p className="mt-1 text-base text-gray-600">Quality Assurance</p>
              </div>
              <div className="text-center w-44">
                <Image
                  src={johndoe}
                  alt="Mark Adrian Dela Cruz"
                  className="rounded-full w-50 h-50 object-cover border-4 border-[#C87616]"
                  width={200}
                  height={200}
                />
                <h3 className="mt-4 text-lg font-semibold">Dela Cruz, Mark Adrian</h3>
                <p className="mt-1 text-base text-gray-600">Project Manager</p>
              </div>
            </div>

            <p className="text-lg leading-7 my-5">
              We are Bachelor of Science in Computer Science students from STI, and DesignGenius represents the culmination of our thesis work. DesignGenius is an AI-powered platform created to assist users in transforming their interior spaces with ease and efficiency. Our website offers a range of AI-driven design solutions, from personalized room layouts to 3D visualizations, catering to homeowners, interior designers, and enthusiasts alike. Through this project, we've combined our passion for technology and design to create a user-friendly tool that makes the design process more accessible and innovative.
            </p>
          </section>

          <section className="flex justify-around gap-12 mt-12">
            <div className="flex-1 p-5 text-center">
              <h2 className="font-bold text-2xl">Vision</h2>
              <p className="text-lg leading-7 mt-5">
                To revolutionize interior design by harnessing the power of AI, making personalized, high-quality design accessible to everyone, and inspiring creativity that transforms living spaces into innovative, functional, and aesthetically pleasing environments.
              </p>
            </div>
            <div className="flex-1 p-5 text-center">
              <h2 className="font-bold text-2xl">Mission</h2>
              <p className="text-lg leading-7 mt-5">
                To provide an AI-powered platform that delivers fast, personalized interior design solutions, enhancing user creativity and satisfaction while offering a seamless and intuitive experience. We aim to give users innovative tools, support professional designers, and create designs that are both sustainable and visually appealing.
              </p>
            </div>
          </section>

          <section className="mt-8 text-center">
            <h2 className="font-bold text-2xl">General Objective</h2>
            <p className="text-lg leading-7 my-5">
              To streamline and optimize the overall time-consuming process of interior designing posed by traditional methods, enhancing productivity and efficiency through the integration of AI and generative design.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;