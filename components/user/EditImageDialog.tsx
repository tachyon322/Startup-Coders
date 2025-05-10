"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
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
import { updateUserImage } from "@/data/user"
import { ProfileImageUpload } from "./ProfileImageUpload"

interface EditImageDialogProps {
  initialImage: string | null | undefined
  username: string
  userId?: string
  onImageUpdated: (newImageUrl: string) => void
}

export function EditImageDialog({ 
  initialImage, 
  username,
  userId,
  onImageUpdated 
}: EditImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  // Convert initialImage to the format expected by ProfileImageUpload
  const initialImageValue = initialImage 
    ? [{ id: "profile-image", url: initialImage }] 
    : []
  
  const [images, setImages] = useState(initialImageValue)

  const handleSubmit = async () => {
    try {
      if (images.length === 0) {
        setError("Please upload a profile image")
        return
      }
      
      setError("")
      setIsSubmitting(true)
      
      // Use the first image from the array
      const imageUrl = images[0].url
      
      // Use userId if available, otherwise use username
      const identifier = userId || username
      await updateUserImage(identifier, imageUrl)
      
      onImageUpdated(imageUrl)
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating profile image:", error)
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
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100"
          aria-label="Изменить фото профиля"
        >
          <Camera className="h-4 w-4 text-gray-700" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить фото профиля</DialogTitle>
          <DialogDescription>
            Загрузите новое фото для вашего профиля
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ProfileImageUpload
            onChange={setImages}
            value={images}
            disabled={isSubmitting}
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