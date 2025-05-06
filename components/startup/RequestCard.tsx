"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Check, X } from "lucide-react";

interface RequestCardProps {
  requestId: string;
  startupName: string;
  startupId: string;
  userName: string;
  userId: string;
  userImage?: string;
  message: string;
  date: Date;
  type: "incoming" | "outgoing";
  onAccept?: (requestId: string) => Promise<void>;
  onReject?: (requestId: string) => Promise<void>;
}

export default function RequestCard({
  requestId,
  startupName,
  startupId,
  userName,
  userId,
  userImage,
  message,
  date,
  type,
  onAccept,
  onReject
}: RequestCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!onAccept) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await onAccept(requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await onReject(requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {userImage ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={userImage}
                  alt={userName || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-lg">
                  {(userName || "A")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {type === "incoming" ? (
                <Link 
                  href={`/user/${userId}`} 
                  className="hover:text-indigo-600 transition-colors"
                >
                  {userName || "Anonymous"}
                </Link>
              ) : (
                <span>You</span>
              )}
              <span className="text-gray-500 font-normal">
                {" "}requested to join{" "}
              </span>
              <Link 
                href={`/startup/${startupId}`} 
                className="hover:text-indigo-600 transition-colors"
              >
                {startupName}
              </Link>
            </h3>
            <div className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <time dateTime={new Date(date).toISOString()}>
                {new Date(date).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
        
        {type === "incoming" && (
          <div className="flex space-x-2">
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors disabled:opacity-50"
              title="Accept request"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
              title="Reject request"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {message && (
        <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 