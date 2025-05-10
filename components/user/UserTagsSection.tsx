"use client"

import { useState, memo } from "react"
import { Tag } from "@/components/ui/tag-input"
import { EditTagsDialog } from "@/components/user/EditTagsDialog"

interface UserTagsSectionProps {
  tags: Tag[]
  username: string | null | undefined
  userId?: string
  isCurrentUser: boolean
}

function UserTagsSectionBase({ 
  tags, 
  username, 
  userId,
  isCurrentUser 
}: UserTagsSectionProps) {
  const [currentTags, setCurrentTags] = useState<Tag[]>(tags || [])

  const handleTagsUpdate = (newTags: Tag[]) => {
    setCurrentTags(newTags)
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {currentTags.length > 0 ? (
        currentTags.map((tag) => (
          <span
            key={tag.id}
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
          >
            {tag.name}
          </span>
        ))
      ) : (
        <span className="text-gray-500 text-sm">Нет тегов технологий</span>
      )}
      
      {isCurrentUser && (username || userId) && (
        <EditTagsDialog
          initialTags={currentTags}
          username={username || ""}
          userId={userId}
          onTagsUpdated={handleTagsUpdate}
        />
      )}
    </div>
  )
}

export const UserTagsSection = memo(UserTagsSectionBase); 