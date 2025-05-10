"use client"

import { useState } from "react"
import { EditUsernameDialog } from "./EditUsernameDialog"

interface UserUsernameSectionProps {
  username: string | null | undefined
  userId: string
  isCurrentUser: boolean
}

export function UserUsernameSection({ 
  username, 
  userId,
  isCurrentUser 
}: UserUsernameSectionProps) {
  const [currentUsername, setCurrentUsername] = useState(username || "")

  const handleUsernameUpdated = (newUsername: string) => {
    setCurrentUsername(newUsername)
  }

  return (
    <div className="flex items-center">
      <p className="text-gray-500">@{currentUsername || "(нет юзернейма)"}</p>
      
      {isCurrentUser && (
        <EditUsernameDialog
          initialUsername={currentUsername}
          userId={userId}
          onUsernameUpdated={handleUsernameUpdated}
        />
      )}
    </div>
  )
} 