'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';

export function MagicLinkVerifier() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get token from URL
        const token = searchParams.get('token');
        
        if (!token) {
          console.error("No token found in URL");
          setStatus('error');
          return;
        }

        // Verify the token
        const { data, error } = await authClient.magicLink.verify({
          query: { token },
        });

        if (error) {
          console.error("Error verifying magic link:", error);
          setStatus('error');
          return;
        }

        setStatus('success');
        
        // Wait briefly before redirecting
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (err) {
        console.error("Failed to verify magic link:", err);
        setStatus('error');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-medium text-gray-700">Проверка ссылки входа...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Ошибка проверки</h2>
        <p className="text-gray-600 mb-4">Ссылка недействительна или срок её действия истек.</p>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={() => router.push('/')}
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-green-600">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Вход выполнен успешно!</h2>
      <p className="text-gray-600">Переадресация...</p>
    </div>
  );
} 