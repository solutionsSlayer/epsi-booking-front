import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden absolute top-0 left-0 z-[-1] ">
      <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-900/80 to-purple-800/60">
        <h1 className="text-5xl uppercase font-bold text-white mb-8 text-shadow">Welcome to Smart Calendar</h1>
        <Image
          src="/logoEpsiFondBlanc.svg"
          alt="EPSI Logo"
          width={400}
          height={150}
          className="mt-8"
        />
        <Link href="/hub">
          <button className="bg-white text-2xl text-black font-medium mt-20 py-2 px-4 rounded">
            CAMPUS
          </button>
        </Link>
      </div>
    </div>
  );
}
