"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Settings } from "lucide-react";
import StartupParticipantsDialog from "./StartupParticipantsDialog";

interface Startup {
  id: string;
  name: string;
  creatorUser: string;
  images: { id: string; url: string }[];
  participantCount: number;
}

interface UserStartupSquaresProps {
  startups: Startup[];
  onRemoveParticipant: (startupId: string, userId: string) => Promise<void>;
}

interface Participant {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

export default function UserStartupSquares({ startups, onRemoveParticipant }: UserStartupSquaresProps) {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [creatorId, setCreatorId] = useState<string>("");
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [participantsError, setParticipantsError] = useState<string | null>(null);

  const handleSquareClick = async (startup: Startup) => {
    setSelectedStartup(startup);
    setDialogOpen(true);
    setIsLoadingParticipants(true);
    setParticipantsError(null);
    
    try {
      const response = await fetch(`/api/startups/${startup.id}/participants`);
      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }
      const data = await response.json();
      setParticipants(data.participants);
      setCreatorId(data.creatorId);
    } catch (error) {
      setParticipantsError(error instanceof Error ? error.message : 'Failed to load participants');
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStartup(null);
    setParticipants([]);
    setCreatorId("");
    setParticipantsError(null);
  };

  if (startups.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          Ваши стартапы
          <span className="ml-2 px-2 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full">
            {startups.length}
          </span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {startups.map((startup) => {
            const mainImage = startup.images[0]?.url;
            
            return (
              <button
                key={startup.id}
                onClick={() => handleSquareClick(startup)}
                className="group relative aspect-square bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {mainImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={mainImage}
                      alt={startup.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                )}
                
                {/* Overlay with startup info */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                  
                  <div className="text-white">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {startup.name}
                    </h3>
                    <div className="flex items-center text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{startup.participantCount} участник{startup.participantCount === 1 ? '' : 'ов'}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedStartup && (
        <StartupParticipantsDialog
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
          startupId={selectedStartup.id}
          startupName={selectedStartup.name}
          participants={participants}
          creatorId={creatorId}
          onRemoveParticipant={async (startupId, userId) => {
            await onRemoveParticipant(startupId, userId);
            // Refresh participants after removal
            setParticipants(prev => prev.filter(p => p.id !== userId));
          }}
          isLoading={isLoadingParticipants}
          error={participantsError}
        />
      )}
    </>
  );
}