"use client"

import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { useMemo, memo } from "react"

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

function StartupCard({ startup }: StartupCardProps) {
  // Memoize truncated description to avoid recalculation on re-renders
  const truncatedDescription = useMemo(() => {
    return startup.description.length > 120
      ? `${startup.description.substring(0, 120)}...`
      : startup.description
  }, [startup.description]);

  // Memoize formatted date to avoid recalculation on re-renders
  const formattedDate = useMemo(() => {
    return formatDistanceToNow(new Date(startup.createdAt), { 
      addSuffix: true, 
      locale: ru 
    });
  }, [startup.createdAt]);
  
  // Memoize tag display to avoid recalculation on re-renders
  const tagDisplay = useMemo(() => {
    if (!startup.tags || startup.tags.length === 0) return null;
    
    return (
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
    );
  }, [startup.tags]);

  // Memoize image display to avoid recalculation on re-renders
  const imageDisplay = useMemo(() => {
    if (startup.images && startup.images.length > 0) {
      return (
        <>
          <Image
            src={startup.images[0].url}
            alt={startup.name}
            fill
            className="object-cover"
          />
          
          {startup.images.length > 1 && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
              +{startup.images.length - 1}
            </div>
          )}
        </>
      );
    }

    return (
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
    );
  }, [startup.images, startup.name]);

  return (
    <Link href={`/startup/${startup.id}`} className="block h-full">
      <div className="bg-white rounded-xs overflow-hidden border border-gray-100 hover:bg-gray-50 transition-all duration-200 h-full flex flex-col">
        <div className="relative h-48 bg-gray-100">
          {imageDisplay}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-indigo-950 truncate">
              {startup.name}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formattedDate}
            </span>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
            {truncatedDescription}
          </p>
          
          {tagDisplay}
          
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
                <span className="font-medium text-indigo-600">
                  {startup.creatorId.username || startup.creatorId.id || 'Аноним'}
                </span>
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
    </Link>
  );
}

// Memoize the entire component to prevent re-renders unless props change
export default memo(StartupCard); 