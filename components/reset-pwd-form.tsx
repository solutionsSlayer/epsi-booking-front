'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      
      if (!token) {
        toast.error("Vous n'êtes pas connecté.");
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/change-password`,
        {
          currentPassword: currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Mot de passe modifié avec succès');
        router.push('/hub');
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error('Erreur lors du changement de mot de passe. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen bg-[rgba(240,240,240,1)] max-w-[500px] max-h-[400px] flex-1 rounded-3xl text-black p-5 min-w-[400px] shadow-[0_10px_20px_rgba(0,0,0,0.19),_0_6px_6px_rgba(0,0,0,0.23)] absolute top-1/2 -translate-y-1/2 w-full">
      <h2 className="text-2xl font-bold mb-4">Changer le mot de passe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block mb-1">
            Mot de passe actuel
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block mb-1">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Changer le mot de passe
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;