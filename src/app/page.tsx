'use client'
import CompareSlider from "@/components/CompareSlider";
import Link from "next/link";
import { useUser, SignInButton } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <main className="relative z-10 min-h-screen flex gap-10 p-11 lg:flex-row flex-col justify-center lg:justify-around items-center">
      <div className="flex relative max-w-xl flex-col items-center gap-5">
        <h1 className="text-black text-5xl font-bold text-center">
          REDESIGNS ROOM IN SECONDS USING{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-black to-[#C87616]">
            <span className="absolute inset-0 bg-gradient-to-r from-black to-[#C87616] rounded-lg blur-[2px]"></span>
            <span className="relative z-10 text-white">DESIGNGENIUS</span>
          </span>
        </h1>
        <p className="text-black text-lg text-center">
          Snap a photo of your room and explore its stunning transformation through a variety of captivating themes.
        </p>
        {isLoaded && (
          isSignedIn ? (
            <Link href="/room">
              <button className="bg-black hover:opacity-90 rounded-lg text-white font-semibold px-5 py-3">
                Redesign your room
              </button>
            </Link>
          ) : (
            <SignInButton mode="modal" redirectUrl="/room">
              <button className="bg-black hover:opacity-90 rounded-lg text-white font-semibold px-5 py-3">
                Redesign your room
              </button>
            </SignInButton>
          )
        )}
      </div>
      <div>
        <CompareSlider />
      </div>
    </main>
  );
}