"use client"

import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface StartupCardProps {
  startup: {
    id: string
    name: string
    description: string
    images: { id: string; url: string }[]
    createdAt: Date
    creatorId: {
      id: string
      name: string | null
      username: string | null
      image: string | null
    }
    participants: {
      id: string
      name: string | null
      username: string | null
      image: string | null
    }[]
    tags: {
      id: number
      name: string
    }[]
  }
}

export default function StartupCard({ startup }: StartupCardProps) {
  // Truncate description to ~120 characters
  const truncatedDescription = 
    startup.description.length > 120
      ? `${startup.description.substring(0, 120)}...`
      : startup.description

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {startup.images && startup.images.length > 0 ? (
          <Image
            src={startup.images[0].url}
            alt={startup.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-indigo-50 text-indigo-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-20 w-20" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
              />
            </svg>
          </div>
        )}
        
        {startup.images && startup.images.length > 1 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            +{startup.images.length - 1}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-indigo-950 truncate">
            <Link href={`/startup/${startup.id}`} className="hover:text-indigo-600 transition-colors">
              {startup.name}
            </Link>
          </h3>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(startup.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {truncatedDescription}
        </p>
        
        {startup.tags && startup.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {startup.tags.slice(0, 3).map(tag => (
              <span 
                key={tag.id} 
                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full"
              >
                {tag.name}
              </span>
            ))}
            {startup.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">
                +{startup.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 overflow-hidden">
              {startup.creatorId.image ? (
                <Image 
                  src={startup.creatorId.image} 
                  alt={startup.creatorId.name || 'Creator'} 
                  width={24} 
                  height={24} 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-indigo-500 text-xs font-bold">
                  {startup.creatorId.name ? startup.creatorId.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="text-sm">
              <span className="text-gray-500">от</span>{" "}
              <Link href={`/user/${startup.creatorId.username || startup.creatorId.id}`} className="font-medium text-indigo-600 hover:text-indigo-700">
                {startup.creatorId.username || startup.creatorId.id || 'Аноним'}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>
              {startup.participants.length > 1 
                ? `${startup.participants.length} участников` 
                : 'Ищет участников'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 