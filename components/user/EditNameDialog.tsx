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
import { Input } from "@/components/ui/input"
import { updateUserName } from "@/data/user"

interface EditNameDialogProps {
  initialName: string | null | undefined
  username: string
  userId?: string
  onNameUpdated: (newName: string) => void
}

export function EditNameDialog({ 
  initialName, 
  username,
  userId,
  onNameUpdated 
}: EditNameDialogProps) {
  const [name, setName] = useState(initialName || "")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        setError("Name cannot be empty")
        return
      }
      
      setError("")
      setIsSubmitting(true)
      
      // Use userId if available, otherwise use username
      const identifier = userId || username
      await updateUserName(identifier, name)
      
      onNameUpdated(name)
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating name:", error)
      setError("An error occurred. Please try again.")
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
          aria-label="Редактировать имя"
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить имя</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
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