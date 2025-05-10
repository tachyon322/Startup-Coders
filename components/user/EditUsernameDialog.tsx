"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateUserUsername } from "@/data/user"
import { useRouter } from "next/navigation"

interface EditUsernameDialogProps {
  initialUsername: string 
  userId?: string
  onUsernameUpdated: (newUsername: string) => void
}

export function EditUsernameDialog({ 
  initialUsername, 
  userId,
  onUsernameUpdated 
}: EditUsernameDialogProps) {
  const [username, setUsername] = useState(initialUsername || "")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      if (!username.trim()) {
        setError("Username cannot be empty")
        return
      }
      
      // Username validation - only allow alphanumeric and underscore
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError("Username can only contain letters, numbers, and underscores")
        return
      }
      
      setError("")
      setIsSubmitting(true)
      
      // Use userId if available, otherwise use the current username
      const identifier = userId || initialUsername
      await updateUserUsername(identifier, username)
      
      onUsernameUpdated(username)
      setIsOpen(false)
      
      // Redirect to the new username page if the username changes
      if (initialUsername !== username) {
        router.push(`/user/${username}`)
      }
    } catch (error) {
      console.error("Error updating username:", error)
      if (error instanceof Error && error.message === "Username already taken") {
        setError("This username is already taken, please choose another one")
      } else {
        setError("An error occurred. Please try again.")
      }
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
          aria-label="Редактировать имя пользователя"
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить имя пользователя</DialogTitle>
          <DialogDescription>
            Это изменит ваш URL профиля и все ссылки на ваш профиль.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Введите новое имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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