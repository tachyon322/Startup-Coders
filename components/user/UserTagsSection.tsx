"use client"

import { useState } from "react"
import { Tag } from "@/components/ui/tag-input"
import { EditTagsDialog } from "@/components/user/EditTagsDialog"

interface UserTagsSectionProps {
  tags: Tag[]
  username: string | null | undefined
  isCurrentUser: boolean
}

export function UserTagsSection({ 
  tags, 
  username, 
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
      
      {isCurrentUser && username && (
        <EditTagsDialog
          initialTags={currentTags}
          username={username}
          onTagsUpdated={handleTagsUpdate}
        />
      )}
    </div>
  )
} 