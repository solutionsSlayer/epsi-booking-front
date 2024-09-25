'use client'
 
import React, { useState } from 'react';

const ComponentForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
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

      const data = await response.json();

      if (response.ok) {
        setSuccess('Connexion réussie!');
        // Gère la connexion réussie (par exemple, stocker le token, rediriger l'utilisateur, etc.)
      } else {
        setError(data.message[0].messages[0].message);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default ComponentForm;