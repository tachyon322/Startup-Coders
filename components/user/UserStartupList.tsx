import React, { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserStartupListProps {
  startups: any[]
  emptyMessage: string
  emptyActionLabel?: string
  emptyActionHref?: string
}

function UserStartupList({ 
  startups, 
  emptyMessage, 
  emptyActionLabel, 
  emptyActionHref 
}: UserStartupListProps) {
  if (startups.length === 0) {
    return (
      <div className="py-10 text-center border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">
          {emptyMessage}
        </h3>
        
        {emptyActionLabel && emptyActionHref && (
          <Link href={emptyActionHref} className="mt-4 inline-block">
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              {emptyActionLabel}
            </Button>
          </Link>
        )}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {startups.map(startup => (
        <StartupCard startup={startup} key={startup.id} />
      ))}
    </div>
  )
}

// Memoized startup card component
const StartupCard = memo(function StartupCard({ startup }: { startup: any }) {
  return (
    <Link
      href={`/startup/${startup.id}`}
      className="block p-4 border rounded-lg hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
          {startup.images && startup.images.length > 0 ? (
            <Image
              src={startup.images[0].url}
              alt={startup.name}
              width={64}
              height={64}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <div className="h-16 w-16 bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-800 font-semibold">
                {startup.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg text-indigo-900">
            {startup.name}
          </h3>
          <p className="text-gray-500 line-clamp-1">
            {startup.description}
          </p>
          
          {startup.tags && startup.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {startup.tags.slice(0, 3).map((tag: { id: number; name: string }) => (
                <span 
                  key={tag.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                >
                  {tag.name}
                </span>
              ))}
              {startup.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500">
                  +{startup.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="whitespace-nowrap">{startup.participants?.length || 0} участников</span>
        </div>
      </div>
    </Link>
  )
});

export default memo(UserStartupList); 