'use client'
import React from 'react'
import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'

const UserInf = () => {

  const { user } = useUser();

  return !user ? (
    <Link href={"/room"} className='bg-black hover:opacity-90 px-10 py-3 rounded-lg text-white font-semibold'>
      Login
    </Link>
  ): (
    <UserButton afterSignOutUrl='/sign-in'/>
  )
}

export default UserInf
