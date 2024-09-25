import Image from 'next/image';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav className="bg-nav shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <Link href="/">
                <Image 
                    src="/logoEpsiFondBlanc.svg" 
                    alt="EPSI Logo" 
                    width={135} 
                    height={40} 
                />
            </Link>
        </div>
        <a href='/login' className="bg-white text-black px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
          Login
        </a>
      </div>
    </nav>
  );
};

export default Nav;
