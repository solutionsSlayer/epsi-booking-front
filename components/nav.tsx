'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useAuth = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  return false;
};

const Nav = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);

  const pathname = usePathname();
  const isAuthenticated = useAuth();

  useEffect(() => {
    setShowLoginButton(!isAuthenticated && pathname !== '/login');
    setIsAuth(isAuthenticated);
  }, [pathname, isAuthenticated]);

  const handleLogout = async () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('isAuthenticated');
    
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) {
      setIsAuth(false);
      toast.success(`À bientôt !`);
      window.location.href = '/';
    } else {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <nav className="bg-nav shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <Link href="/">
                <Image 
                    src="/logoEpsiFondBlanc.svg" 
                    alt="EPSI Logo" 
                    width={150} 
                    height={150} 
                />
            </Link>
        </div>
        {showLoginButton ? (
        <Link href='/login' className="bg-white text-black px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
        Login
      </Link> 
         ) : isAuth ? (
      <button onClick={handleLogout} className="bg-white text-black px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
        Déconnexion
      </button>) : null }
        
      </div>
    </nav>
  );
};

export default Nav;
