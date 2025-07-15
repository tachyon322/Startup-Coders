"use client"

import { useState } from "react"
import { UserAvatarPlaceholder } from "../ui/ImagePlaceholder"
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
    <div className="relative">
      <UserAvatarPlaceholder
        user={{
          name,
          username,
          image: currentImage
        }}
        size="2xl"
        shape="square"
        className="border-4 border-white shadow-lg rounded-xl"
        priority
        alt={name || username || "Пользователь (без имени)"}
      />
      
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