'use client';

import React, { useEffect, useState } from 'react';
import ResetPwdForm from '@/components/reset-pwd-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      setToken(jwtToken);
    } else {
      toast.error("Vous n'êtes pas connecté.");
      router.push('/login');
    }
  }, [router]);

  return (
    <div className='flex items-center justify-center'>
      {token && <ResetPwdForm />}
    </div>
  );
};

export default Page;
