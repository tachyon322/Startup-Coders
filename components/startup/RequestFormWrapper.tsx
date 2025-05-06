"use client";

import { useRouter } from "next/navigation";
import RequestForm from "./RequestForm";

export default function RequestFormWrapper({ startupId }: { startupId: string }) {
  const router = useRouter();
  
  const handleSuccess = () => {
    // Refresh the page to show updated state
    router.refresh();
  };
  
  const handleError = (error: string) => {
    alert(error);
  };
  
  return (
    <RequestForm
      startupId={startupId}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
} 