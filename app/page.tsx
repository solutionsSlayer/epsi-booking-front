import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-900/80 to-purple-800/60">
        <h1 className="text-4xl font-bold text-white mb-8 text-shadow">Welcome to Smart Calendar</h1>
        <Image
          src="/logoEpsiFondBlanc.svg"
          alt="EPSI Logo"
          width={150}
          height={50}
          className="mt-8"
        />
      </div>
    </div>
  );
}
