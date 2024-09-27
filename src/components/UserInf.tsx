'use client'
import React from 'react'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'

const UserInf = () => {
  const { isSignedIn, user } = useUser();

  return !isSignedIn ? (
    <SignInButton mode="modal">
      <button className="bg-black hover:opacity-90 px-10 py-3 rounded-lg text-white font-semibold">
        Login
      </button>
    </SignInButton>
  ) : (
    <UserButton afterSignOutUrl='/'/>
  )
}

export default UserInf