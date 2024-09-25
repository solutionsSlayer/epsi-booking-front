'use client'
 
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComponentForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log('Tentative de connexion...');
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      console.log('Réponse reçue:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur de réponse:', errorData);
        
        if (errorData.error && errorData.error.message) {
          if (errorData.error.message.includes('identifier')) {
            toast.error('Login incorrect');
          } else if (errorData.error.message.includes('password')) {
            toast.error('Mot de passe incorrect');
          } else {
            toast.error('Erreur de connexion');
          }
        } else {
          toast.error('Erreur de connexion');
        }
        return;
      }

      const data = await response.json();
      console.log('Données reçues:', data);

      if (data.jwt) {
        toast.success('Connexion réussie!');
        // Stockez le token JWT ici si nécessaire
      } else {
        toast.error('Erreur de connexion: Pas de token reçu');
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      toast.error('Une erreur est survenue lors de la connexion');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center justify-center h-screen'>
        <div className='flex flex-col gap-2'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      <ToastContainer />
    </>
  );
};

export default ComponentForm;