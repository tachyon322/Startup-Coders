"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

interface RequestActionsProps {
  requestId: string;
  startupId: string;
}

export default function RequestActions({ requestId, startupId }: RequestActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAccept = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/startups/${startupId}/requests/${requestId}/accept`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to accept request");
      }
      
      // Refresh the page to show updated state
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/startups/${startupId}/requests/${requestId}/reject`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject request");
      }
      
      // Refresh the page to show updated state
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 