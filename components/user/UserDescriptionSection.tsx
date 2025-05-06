"use client"

import { useState } from "react"
import { EditDescriptionDialog } from "./EditDescriptionDialog"

interface UserDescriptionSectionProps {
  description: string | null | undefined
  username: string | null | undefined
  isCurrentUser: boolean
}

export function UserDescriptionSection({ 
  description, 
  username, 
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
        {isCurrentUser && username && (
          <EditDescriptionDialog 
            initialDescription={currentDescription} 
            username={username}
            onDescriptionUpdated={handleDescriptionUpdate}
          />
        )}
      </div>
    </div>
  )
} 