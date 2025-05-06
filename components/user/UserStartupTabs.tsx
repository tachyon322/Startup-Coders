"use client"

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import UserStartupList from './UserStartupList'

interface UserStartupTabsProps {
  username: string
  createdStartups: any[]
  participatingStartups: any[]
  isCurrentUser: boolean
}

export default function UserStartupTabs({ 
  username, 
  createdStartups, 
  participatingStartups,
  isCurrentUser 
}: UserStartupTabsProps) {
  const [activeTab, setActiveTab] = useState("created")
  
  return (
    <div className="mt-8">
      <Tabs defaultValue="created" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="created">
            Созданные стартапы ({createdStartups.length})
          </TabsTrigger>
          <TabsTrigger value="participating">
            Участия в стартапах ({participatingStartups.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="mt-0">
          <UserStartupList 
            startups={createdStartups} 
            emptyMessage={
              isCurrentUser
                ? "Вы еще не создали ни одного стартапа"
                : `${username} еще не создал ни одного стартапа`
            }
            emptyActionLabel={isCurrentUser ? "Создать стартап" : undefined}
            emptyActionHref={isCurrentUser ? "/startup/create" : undefined}
          />
        </TabsContent>
        
        <TabsContent value="participating" className="mt-0">
          <UserStartupList 
            startups={participatingStartups} 
            emptyMessage={
              isCurrentUser
                ? "Вы еще не участвуете ни в одном стартапе"
                : `${username} еще не участвует ни в одном стартапе`
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 