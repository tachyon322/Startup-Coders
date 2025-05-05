import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Users, Globe, Calendar, ArrowLeft } from "lucide-react"
import UserAvatar from "./UserAvatar"
import StartupMetadata from "./StartupMetadata"

interface StartupDetailProps {
  startup: {
    id: string
    name: string
    description: string
    images: { id: string; url: string }[]
    websiteUrl: string | null
    createdAt: Date
    updatedAt: Date
    creatorId: {
      id: string
      name: string | null
      username: string | null
      image: string | null
      description: string | null
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

export default function StartupDetail({ startup }: StartupDetailProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to startups
        </Link>
      </div>

      {/* Header section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        {/* Images carousel/gallery */}
        <div className="relative h-80 md:h-96 bg-gray-100">
          {startup.images && startup.images.length > 0 ? (
            <Image
              src={startup.images[0].url}
              alt={startup.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-indigo-50 text-indigo-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-32 w-32" 
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
        </div>

        {/* Title and metadata */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-indigo-950">{startup.name}</h1>
            
            <div className="flex items-center space-x-4">
              {startup.websiteUrl && (
                <a 
                  href={startup.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span>Website</span>
                </a>
              )}
              
              {/* Here you could add buttons for joining/contacting */}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {startup.tags.map(tag => (
              <span 
                key={tag.id} 
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        
        {/* Creator info and date */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserAvatar user={startup.creatorId} />
              <div>
                <p className="font-medium">
                  <span className="text-gray-500">Created by </span>
                  <Link 
                    href={`/user/${startup.creatorId.username || startup.creatorId.id}`}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {startup.creatorId.name || startup.creatorId.username || 'Anonymous'}
                  </Link>
                </p>
                {startup.creatorId.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {startup.creatorId.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={format(new Date(startup.createdAt), 'yyyy-MM-dd')}>
                {format(new Date(startup.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description and details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-indigo-950 mb-4">About</h2>
            <div className="prose max-w-none text-gray-700">
              {/* Render description with proper line breaks */}
              {startup.description.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* Image gallery for multiple images */}
          {startup.images.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-indigo-950 mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {startup.images.map(image => (
                  <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={startup.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          
          {/* Participants */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-indigo-950">Participants</h2>
              <div className="flex items-center text-indigo-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{startup.participants.length}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {startup.participants.map(user => (
                <div key={user.id} className="flex items-center space-x-3">
                  <UserAvatar user={user} size="sm" />
                  <div>
                    <Link 
                      href={`/user/${user.username || user.id}`}
                      className="font-medium text-indigo-700 hover:text-indigo-900 transition-colors"
                    >
                      {user.name || user.username || 'Anonymous'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 