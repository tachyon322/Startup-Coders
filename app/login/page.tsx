'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginModal from '@/components/auth/LoginModal';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  
  const handleClose = () => {
    router.push(returnTo);
  };

  return <LoginModal isOpen={true} onClose={handleClose} />;
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}