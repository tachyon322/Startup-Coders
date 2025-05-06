'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import LoginModal from '@/components/auth/LoginModal';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  
  const handleClose = () => {
    router.push(returnTo);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <LoginModal isOpen={true} onClose={handleClose} />
    </main>
  );
}