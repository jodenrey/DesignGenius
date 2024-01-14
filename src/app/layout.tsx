import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import couch from '@/assets/couch.svg';
import { ClerkProvider } from '@clerk/nextjs'
import UserInf from '@/components/UserInf'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DesignGenius',
  description: 'This is DesignGenius which genterate room design based on our style',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={
            inter.className + " bg-[#17181c] flex flex-col min-h-screen"
          }>
          <header className='w-full'>
            <div className='container p-5 mx-auto flex items-center justify-between'>
              <Link href={"/"} className='flex items-center gap-3'>
                <Image src={couch} alt='couch' height={50} width={50}/>
                <h3 className='text-white md:text-3xl text-2xl font-bold'>DesignGenius</h3>
              </Link>
              {/* User Info */}
              <UserInf />
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
