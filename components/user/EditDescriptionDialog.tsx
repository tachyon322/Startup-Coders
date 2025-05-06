"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateUserDescription } from "@/data/user"

interface EditDescriptionDialogProps {
  initialDescription: string | null | undefined
  username: string
  onDescriptionUpdated: (newDescription: string) => void
}

export function EditDescriptionDialog({ 
  initialDescription, 
  username,
  onDescriptionUpdated 
}: EditDescriptionDialogProps) {
  const [description, setDescription] = useState(initialDescription || "")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await updateUserDescription(username, description)
      onDescriptionUpdated(description)
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating description:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 h-6 w-6 rounded-full hover:bg-gray-100"
          aria-label="Редактировать описание"
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать описание</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Add a description about yourself..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 