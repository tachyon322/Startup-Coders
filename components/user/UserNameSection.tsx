"use client"

import { useState } from "react"
import { EditNameDialog } from "./EditNameDialog"

interface UserNameSectionProps {
  name: string | null | undefined
  username: string | null | undefined
  userId: string
  isCurrentUser: boolean
}

export function UserNameSection({ 
  name, 
  username,
  userId,
  isCurrentUser 
}: UserNameSectionProps) {
  const [currentName, setCurrentName] = useState(name || "")

  const handleNameUpdated = (newName: string) => {
    setCurrentName(newName)
  }

  return (
    <div className="flex items-center">
      <h1 className="text-3xl font-bold text-indigo-950">
        {currentName || "Пользователь (без имени)"}
      </h1>
      
      {isCurrentUser && (
        <EditNameDialog
          initialName={currentName}
          username={username || ""}
          userId={userId}
          onNameUpdated={handleNameUpdated}
        />
      )}
    </div>
  )
} 