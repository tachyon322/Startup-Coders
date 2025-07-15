"use client"

import React, { useState, memo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import UserStartupList from './UserStartupList'

interface UserStartupTabsProps {
  username: string
  userId?: string
  createdStartups: any[]
  participatingStartups: any[]
  isCurrentUser: boolean
}

function UserStartupTabs({ 
  username, 
  userId,
  createdStartups, 
  participatingStartups,
  isCurrentUser 
}: UserStartupTabsProps) {
  const [activeTab, setActiveTab] = useState("created")
  
  return (
    <div className="mt-8">
      <Tabs defaultValue="created" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-8 h-auto sm:h-10">
          <TabsTrigger value="created" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-normal sm:whitespace-nowrap text-center">
            <span className="block sm:inline">Созданные стартапы</span>
            <span className="block sm:inline sm:ml-1">({createdStartups.length})</span>
          </TabsTrigger>
          <TabsTrigger value="participating" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-normal sm:whitespace-nowrap text-center">
            <span className="block sm:inline">Участия в стартапах</span>
            <span className="block sm:inline sm:ml-1">({participatingStartups.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="mt-0">
          <UserStartupList 
            startups={createdStartups} 
            emptyMessage={
              isCurrentUser
                ? "Вы не создали ни одного стартапа"
                : `${username} не создал ни одного стартапа`
            }
            emptyActionLabel={isCurrentUser ? "Создать стартап" : undefined}
            emptyActionHref={isCurrentUser ? "/create" : undefined}
          />
        </TabsContent>
        
        <TabsContent value="participating" className="mt-0">
          <UserStartupList 
            startups={participatingStartups} 
            emptyMessage={
              isCurrentUser
                ? "Вы не участвуете ни в одном стартапе"
                : `${username} не участвует ни в одном стартапе`
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 

export default memo(UserStartupTabs); 
