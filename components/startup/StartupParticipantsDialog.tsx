"use client";

import { useState } from "react";
import Image from "next/image";
import { X, UserMinus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Participant {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface StartupParticipantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  startupId: string;
  startupName: string;
  participants: Participant[];
  creatorId: string;
  onRemoveParticipant: (startupId: string, userId: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function StartupParticipantsDialog({
  isOpen,
  onClose,
  startupId,
  startupName,
  participants,
  creatorId,
  onRemoveParticipant,
  isLoading = false,
  error: externalError = null
}: StartupParticipantsDialogProps) {
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleRemoveParticipant = async (userId: string) => {
    setRemovingUserId(userId);
    setInternalError(null);
    
    try {
      await onRemoveParticipant(startupId, userId);
    } catch (err) {
      setInternalError(err instanceof Error ? err.message : "Failed to remove participant");
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-indigo-900">
            Участники - {startupName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : externalError ? (
            <div className="text-center text-red-500 py-8">
              {externalError}
            </div>
          ) : participants.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              В этом стартапе пока нет участников
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {participant.image ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={participant.image}
                          alt={participant.name || "User"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {(participant.name || participant.username || "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.name || participant.username || "Anonymous"}
                        {participant.id === creatorId && (
                          <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                            Создатель
                          </span>
                        )}
                      </p>
                      {participant.username && (
                        <p className="text-sm text-gray-500">@{participant.username}</p>
                      )}
                    </div>
                  </div>
                  
                  {participant.id !== creatorId ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      disabled={removingUserId === participant.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {removingUserId === participant.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UserMinus className="w-4 h-4" />
                      )}
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-400 px-3">
                      Создатель
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {internalError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {internalError}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}