import { MagicLinkVerifier } from '@/components/auth/MagicLinkVerifier';
import { Suspense } from 'react';

export default function VerifyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Suspense fallback={<div className="flex justify-center"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <MagicLinkVerifier />
      </Suspense>
    </div>
  );
} 