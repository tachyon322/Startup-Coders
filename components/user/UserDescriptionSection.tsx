"use client"

import { useState, memo } from "react"
import { EditDescriptionDialog } from "./EditDescriptionDialog"

interface UserDescriptionSectionProps {
  description: string | null | undefined
  username: string | null | undefined
  userId?: string
  isCurrentUser: boolean
}

function UserDescriptionSectionBase({ 
  description, 
  username, 
  userId,
  isCurrentUser 
}: UserDescriptionSectionProps) {
  const [currentDescription, setCurrentDescription] = useState(description)

  const handleDescriptionUpdate = (newDescription: string) => {
    setCurrentDescription(newDescription)
  }

  return (
    <div className="mt-4 relative">
      <div className="flex items-start">
        <p className="text-gray-700">
          {currentDescription || "Нет описания"}
        </p>
        {isCurrentUser && (username || userId) && (
          <EditDescriptionDialog 
            initialDescription={currentDescription} 
            username={username || ""}
            userId={userId}
            onDescriptionUpdated={handleDescriptionUpdate}
          />
        )}
      </div>
    </div>
  )
}

export const UserDescriptionSection = memo(UserDescriptionSectionBase); 