"use client"

import { useState } from "react"
import Image from "next/image"
import { EditImageDialog } from "./EditImageDialog"

interface UserImageSectionProps {
  image: string | null | undefined
  name: string | null | undefined
  username: string | null | undefined
  userId: string
  isCurrentUser: boolean
}

export function UserImageSection({ 
  image, 
  name,
  username,
  userId,
  isCurrentUser 
}: UserImageSectionProps) {
  const [currentImage, setCurrentImage] = useState(image || "")

  const handleImageUpdated = (newImageUrl: string) => {
    setCurrentImage(newImageUrl)
  }

  return (
    <div className="relative h-32 w-32 bg-indigo-100 border-4 border-white shadow-lg rounded-xl">
      {currentImage ? (
        <Image
          src={currentImage}
          alt={name || "Пользователь (без имени)"}
          fill
          className="rounded-xl object-cover object-center"
          quality={70}
          priority
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-indigo-500">
          {name ? name.charAt(0).toUpperCase() : username ? username.charAt(0).toUpperCase() : "U"}
        </div>
      )}
      
      {isCurrentUser && (
        <EditImageDialog
          initialImage={currentImage}
          username={username || ""}
          userId={userId}
          onImageUpdated={handleImageUpdated}
        />
      )}
    </div>
  )
} 