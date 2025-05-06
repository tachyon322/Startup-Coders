"use client"

import { useState, useEffect } from "react"
import { Tag, TagInput } from "@/components/ui/tag-input"
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
import { Label } from "@/components/ui/label"
import { updateUserTags, getAllTags } from "@/data/user"

interface EditTagsDialogProps {
  initialTags: Tag[]
  username: string
  onTagsUpdated: (newTags: Tag[]) => void
}

export function EditTagsDialog({ 
  initialTags, 
  username,
  onTagsUpdated 
}: EditTagsDialogProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags || [])
  const [existingTags, setExistingTags] = useState<Tag[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch existing tags when the dialog opens
  useEffect(() => {
    const fetchTags = async () => {
      if (!isOpen) return
      
      try {
        setIsLoading(true)
        const allTags = await getAllTags()
        setExistingTags(allTags)
      } catch (error) {
        console.error("Error fetching tags:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [isOpen])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await updateUserTags(username, tags)
      onTagsUpdated(tags)
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating tags:", error)
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
          className="h-7 w-7 rounded-full hover:bg-gray-100"
          aria-label="Редактировать теги"
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать теги</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="tags">Теги</Label>
            <TagInput
              existingTags={existingTags}
              selectedTags={tags}
              onChange={setTags}
              disabled={isLoading}
              placeholder={isLoading ? "Загрузка тегов..." : "Введите теги..."}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Добавьте теги технологий и навыков, чтобы помочь другим пользователям найти вас
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting || isLoading}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 