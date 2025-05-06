import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface UserProfileNavProps {
  username: string
  activePath?: string
}

export default function UserProfileNav({ username, activePath }: UserProfileNavProps) {
  const tabs = [
    {
      label: 'Профиль',
      href: `/user/${username}`,
      active: activePath === `/user/${username}` || !activePath
    },
    {
      label: 'Созданные стартапы',
      href: `/user/${username}/created`,
      active: activePath === `/user/${username}/created`
    },
    {
      label: 'Участия в стартапах',
      href: `/user/${username}/participating`,
      active: activePath === `/user/${username}/participating`
    }
  ]
  
  return (
    <div className="border-b border-gray-200">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex -mb-px space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                tab.active 
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
              aria-current={tab.active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 