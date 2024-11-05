'use client'
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/white.svg';
import { ClerkProvider } from '@clerk/nextjs';
import UserInf from '@/components/UserInf';
import { useState } from 'react';
import InitializeUser from '@/components/InitializeUser';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ClerkProvider>
    <InitializeUser />
      <html lang="en">
        <body
          className={inter.className}
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <header className="md:w-full">
            <div className="container p-5 mx-auto flex items-center justify-between bg-transparent md:flex-row">
              <Link href="/" className="flex items-center gap-3">
                <Image src={logo} alt="logo" height={40} width={40} />
                <h3 className="text-white md:text-3xl text-2xl font-bold">
                  DesignGenius
                </h3>
              </Link>

              {/* Hamburger menu for small screens */}
              <button
                onClick={toggleSidebar}
                className="text-white md:hidden focus:outline-none"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>

              {/* Sidebar for small screens */}
              <div
                className={`fixed top-0 left-0 h-full w-1/2 bg-[#C87616] z-50 transform ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out md:hidden`}
              >
                <div className="flex flex-col items-start p-6 space-y-4 h-full">
                  <button
                    onClick={toggleSidebar}
                    className="text-white focus:outline-none self-end"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <Link
                    href="/about-us"
                    className="text-white text-xl font-medium border-b-2 border-transparent hover:border-white"
                    onClick={toggleSidebar}
                  >
                    About Us
                  </Link>

                  <Link
                    href="/design"
                    className="text-white text-xl font-medium border-b-2 border-transparent hover:border-white"
                    onClick={toggleSidebar}
                  >
                    Design
                  </Link>


                  <Link
                    href="/pricing"
                    className="text-white text-xl font-medium border-b-2 border-transparent hover:border-white"
                    onClick={toggleSidebar}
                  >
                    Pricing
                  </Link>

                  <Link
                    href="/faq"
                    className="text-white text-xl font-medium border-b-2 border-transparent hover:border-white"
                    onClick={toggleSidebar}
                  >
                    FAQ
                  </Link>

                  {/* User Info */}
                  <div className="mt-4"  onClick={toggleSidebar}>
                    <UserInf />
                  </div>
                </div>
              </div>

              {/* Standard header for medium and larger screens */}
              <div className="hidden md:flex items-center gap-8">

              <Link
                  href="/about-us"
                  className="text-white md:text-xl text-lg font-medium border-b-2 border-transparent hover:border-white"
                >
                  About Us
                </Link>

              <Link
                  href="/design"
                  className="text-white md:text-xl text-lg font-medium border-b-2 border-transparent hover:border-white"
                >
                  Design
                </Link>
              <Link
                  href="/pricing"
                  className="text-white md:text-xl text-lg font-medium border-b-2 border-transparent hover:border-white"
                >
                  Pricing
                </Link>
                <Link
                  href="/faq"
                  className="text-white md:text-xl text-lg font-medium border-b-2 border-transparent hover:border-white"
                >
                  FAQ
                </Link>
               
                {/* User Info */}
                <div className="mt-4 md:mt-0">
                  <UserInf />
                </div>
              </div>
            </div>

            {children}
          </header>
        </body>
      </html>
    </ClerkProvider>
  );
}