"use client";

import { useRouter } from "next/navigation";
import UserStartupSquares from "./UserStartupSquares";

interface Startup {
  id: string;
  name: string;
  creatorUser: string;
  images: { id: string; url: string }[];
  participantCount: number;
}

interface UserStartupSquaresWrapperProps {
  startups: Startup[];
}

export default function UserStartupSquaresWrapper({ startups }: UserStartupSquaresWrapperProps) {
  const router = useRouter();

  const handleRemoveParticipant = async (startupId: string, userId: string) => {
    const response = await fetch(`/api/startups/${startupId}/participants/${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove participant');
    }
    
    // Refresh the page to show updated data
    router.refresh();
  };

  return (
    <UserStartupSquares 
      startups={startups}
      onRemoveParticipant={handleRemoveParticipant}
    />
  );
}