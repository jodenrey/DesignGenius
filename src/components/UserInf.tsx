'use client'
import React from 'react'
import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'

const UserInf = () => {

  const { user } = useUser();

  return !user ? (
    <Link href={"/room"} className='bg-blue-500 hover:opacity-90 px-5 py-3 rounded-lg text-white font-semibold'>
      Login
    </Link>
  ): (
    <UserButton />
  )
}

export default UserInf
