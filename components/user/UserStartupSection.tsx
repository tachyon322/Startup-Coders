import React from 'react'
import StartupGrid from '@/components/startup/StartupGrid'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

interface UserStartupSectionProps {
  title: string
  subtitle: string
  startups: any[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
  baseUrl: string
  showCreateButton?: boolean
  emptyMessage?: string
  emptyDescription?: string
}

export default function UserStartupSection({
  title,
  subtitle,
  startups,
  pagination,
  baseUrl,
  showCreateButton = false,
  emptyMessage = "No startups found",
  emptyDescription = "There are no startups to display.",
}: UserStartupSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950">{title}</h2>
          <p className="mt-1 text-gray-500">{subtitle}</p>
        </div>
        
        {showCreateButton && (
          <Link href="/create">
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Startup
            </Button>
          </Link>
        )}
      </div>
      
      {startups.length === 0 ? (
        <div className="py-10 text-center border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">
            {emptyMessage}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            {emptyDescription}
          </p>
          
          {showCreateButton && (
            <Link href="/create" className="mt-4 inline-block">
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Create Your First Startup
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <StartupGrid 
          startups={startups} 
          pagination={pagination} 
          baseUrl={baseUrl} 
        />
      )}
    </div>
  )
} 