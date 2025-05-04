"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { TagInput, Tag } from "@/components/ui/tag-input"
import { createStartup } from "@/data/startup"

interface StartupFormProps {
  tags: Tag[];
}

export default function StartupForm({ tags }: StartupFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [images, setImages] = useState<{ id: string; url: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
    tags?: string;
  }>({})
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  
  const validateForm = () => {
    const errors: {
      name?: string;
      description?: string;
      tags?: string;
    } = {}
    let isValid = true
    
    if (!name.trim()) {
      errors.name = "Название обязательно"
      isValid = false
    }
    
    if (!description.trim()) {
      errors.description = "Описание обязательно"
      isValid = false
    } else if (description.length < 20) {
      errors.description = "Описание должно быть не менее 20 символов"
      isValid = false
    }
    
    if (selectedTags.length === 0) {
      errors.tags = "Выберите хотя бы один тег стека технологий"
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (!validateForm()) {
      return
    }
    
    startTransition(async () => {
      try {
        await createStartup(
          name,
          description,
          selectedTags,
          images
        )
        setShowSuccessToast(true)
        
        // Reset form after successful submission
        setName("")
        setDescription("")
        setSelectedTags([])
        setImages([])
        
        // Navigate after a brief delay to show the toast
        setTimeout(() => {
          router.push("/find")
          router.refresh()
        }, 1500)
      } catch (error) {
        console.error("Ошибка при создании стартапа:", error)
        setError("Не удалось создать стартап. Пожалуйста, попробуйте снова.")
      }
    })
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Toast 
        visible={showSuccessToast} 
        onClose={() => setShowSuccessToast(false)}
        variant="success"
      >
        <div className="flex items-center">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-medium">Успех!</h3>
            <p className="text-sm">Стартап успешно создан.</p>
          </div>
        </div>
      </Toast>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="name">Название стартапа</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (formErrors.name) {
                setFormErrors({...formErrors, name: undefined})
              }
            }}
            placeholder="Введите название вашего стартапа"
            disabled={isPending}
            className={formErrors.name ? "border-red-500" : ""}
          />
          {formErrors.name && (
            <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (formErrors.description) {
                setFormErrors({...formErrors, description: undefined})
              }
            }}
            placeholder="Опишите свою идею стартапа подробно..."
            className={`min-h-[150px] ${formErrors.description ? "border-red-500" : ""}`}
            disabled={isPending}
          />
          {formErrors.description ? (
            <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Вы можете добавить свои контакты для связи
            </p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="tags">Теги</Label>
          <TagInput
            existingTags={tags}
            selectedTags={selectedTags}
            onChange={(tags) => {
              setSelectedTags(tags)
              if (formErrors.tags) {
                setFormErrors({...formErrors, tags: undefined})
              }
            }}
            disabled={isPending}
            className={formErrors.tags ? "border-red-500" : ""}
            placeholder="Введите теги..."
          />
          {formErrors.tags ? (
            <p className="text-sm text-red-500 mt-1">{formErrors.tags}</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Добавьте теги технологий которые вы используете, чтобы помочь другим пользователям найти вас
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Изображения</Label>
          <ImageUpload
            value={images}
            onChange={setImages}
            disabled={isPending}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Добавьте изображения, чтобы показать макеты или идеи (необязательно)
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <Button
            type="submit"
            disabled={isPending}
            className={`relative ${isPending ? "pl-9" : ""}`}
          >
            {isPending && (
              <span className="absolute left-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
            {isPending ? "Создание..." : "Создать стартап"}
          </Button>
          <Button 
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Отменить
          </Button>
        </div>
      </form>
    </div>
  )
}