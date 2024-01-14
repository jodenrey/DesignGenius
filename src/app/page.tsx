import CompareSlider from "@/components/CompareSlider";
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  return (
    <main className="my-auto flex gap-10 p-11 lg:flex-row flex-col justify-center lg:justify-around items-center">
      <div className="flex relative max-w-xl flex-col items-center gap-5 gradiant-bg">
        <h1 className="text-white text-5xl font-bold text-center ">
          Redesign rooms in seconds using{" "}
          <span className="text-blue-500">DesignGenius</span>
        </h1>
        <p className="text-slate-400 text-lg text-center">
          Snap a photo of your room and explore its stunning transformation through a variety of captivating themes.
        </p>
        <Link href={"/room"}>
          <button className="bg-blue-500 hover:opacity-90 rounded-lg text-white font-semibold px-5 py-3">
            Redesign your room
          </button>
        </Link>
      </div>
      <div>
        <CompareSlider />
      </div>
    </main>
  )
}
