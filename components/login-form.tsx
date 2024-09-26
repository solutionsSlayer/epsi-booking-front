'use client'
 
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'An error occurred during login');
        return;
      }

      if (data.success) {
        const username = data.user.username || data.user.email;
        toast.success(`Bonjour ${username} !`);
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/hub');
      } else {
        toast.error('Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      toast.error('An error occurred during login');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center justify-center h-screen bg-[rgba(240,240,240,1)] max-w-[500px] max-h-[400px] flex-1 rounded-3xl text-black p-5 min-w-[400px] shadow-[0_10px_20px_rgba(0,0,0,0.19),_0_6px_6px_rgba(0,0,0,0.23)]  absolute top-1/2 -translate-y-1/2 w-full'>
      <h2 className="text-2xl font-bold text-gray-800 mt-5 mb-2">Connexion</h2>
        <div className='flex px-4 w-full flex-col gap-2'>
          <label>Email:</label>
          <input
            className='rounded-md p-2 w-full border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-colors'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='flex px-4 w-full flex-col gap-2'>
          <label>Mot de passe:</label>
          <input
            className='rounded-md p-2 w-full border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-colors'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='mb-4 mt-3 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg'>Se connecter</button>
      </form>
    </>
  );
};

export default LoginForm;