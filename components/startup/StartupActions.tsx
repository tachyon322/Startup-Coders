"use client";

import Link from "next/link";
import { memo } from "react";
import { useRouter } from "next/navigation";
import RequestForm from "./RequestForm";

interface StartupActionsProps {
  startupId: string;
  isLoggedIn: boolean;
  isCreator: boolean;
  isParticipant: boolean;
  hasRequested: boolean;
}

// Memoize component to prevent unnecessary re-renders
const StartupActions = memo(function StartupActions({
  startupId,
  isLoggedIn,
  isCreator,
  isParticipant,
  hasRequested,
}: StartupActionsProps) {
  const router = useRouter();
  
  const handleSuccess = () => {
    router.refresh();
  };
  
  const handleError = (error: string) => {
    alert(error);
  };
  
  // Determine the appropriate action based on user state
  if (!isLoggedIn) {
    return (
      <Link 
        href={`/login?returnTo=/startup/${startupId}`}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors inline-block text-center"
      >
        Войти для участия
      </Link>
    );
  }
  
  if (isCreator) {
    return (
      <button 
        disabled
        className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
      >
        Вы создатель проекта
      </button>
    );
  }
  
  if (isParticipant) {
    return (
      <button 
        disabled
        className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
      >
        Вы уже участник
      </button>
    );
  }
  
  if (hasRequested) {
    return (
      <button 
        disabled
        className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
      >
        Заявка отправлена
      </button>
    );
  }
  
  return (
    <RequestForm
      startupId={startupId}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
});

export default StartupActions; 