'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useAuth = () => {
  let token = null;

  if (typeof window !== 'undefined') {
    // Ici, localStorage est accessible car nous sommes côté client
    token = localStorage.getItem('jwtToken');
  }
  
  return !!token; // Si le token est présent, l'utilisateur est authentifié
};





const Nav = () => {

  const [isAuth, setIsAuth] = useState(false);

  const authenticated = useAuth();
  const pathname = usePathname();
  const [showLoginButton, setShowLoginButton] = useState(false);

  const isAuthenticated = useAuth();

  useEffect(() => {
    setShowLoginButton(!isAuthenticated && pathname !== '/login');
  }, [pathname, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuth(false);
    toast.success(`À bientot !`);
    // Rediriger l'utilisateur vers la page de connexion ou d'accueil
  };

  useEffect(() => {
    setIsAuth(authenticated);
  }, [authenticated]);

  return (
    <nav className="bg-nav shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src="/logoEpsiFondBlanc.svg" 
            alt="EPSI Logo" 
            width={135} 
            height={40} 
          />
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
