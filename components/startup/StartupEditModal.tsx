"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import StartupEditForm from "./StartupEditForm"
import { Tag } from "@/components/ui/tag-input"

interface StartupEditModalProps {
  startupId: string;
  initialData: {
    name: string;
    description: string;
    tags: Tag[];
    images: { id: string; url: string }[];
  };
  availableTags: Tag[];
  onSuccess?: () => void;
}

export default function StartupEditModal({ 
  startupId, 
  initialData, 
  availableTags, 
  onSuccess 
}: StartupEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    if (onSuccess) {
      onSuccess();
    }
    // Refresh the page to show updated data
    window.location.reload();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="secondary" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Pencil size={20} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать стартап</DialogTitle>
          </DialogHeader>
          
          <StartupEditForm
            startupId={startupId}
            initialData={initialData}
            availableTags={availableTags}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}