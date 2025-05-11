import Image from "next/image";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Suspense } from "react";

interface StartupSidebarProps {
  creatorId: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    description: string | null;
  };
  participants: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  }[];
  createdAt: string | Date;
  children?: React.ReactNode;
}

export default function StartupSidebar({ 
  creatorId, 
  participants, 
  createdAt, 
  children 
}: StartupSidebarProps) {
  const formattedDate = typeof createdAt === 'string' 
    ? new Date(createdAt).toLocaleDateString() 
    : createdAt.toLocaleDateString();

  return (
    <div className="md:w-1/3">
      <div className="bg-gray-50 rounded-xs overflow-hidden">
        {/* Join button or form */}
        <div className="p-6">
          {/* Action buttons from parent */}
          {children}
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={new Date(createdAt).toISOString()}>
                Создано {formattedDate}
              </time>
            </div>
          </div>
        </div>
        
        {/* Creator */}
        <div className="p-6 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-indigo-950 mb-4">Создатель</h2>
          <Link href={`/user/${creatorId.username || creatorId.id}`} className="flex items-start space-x-4">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
              {creatorId.image ? (
                <Image
                  src={creatorId.image}
                  alt={creatorId.name || 'Creator'}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-600 font-medium text-lg">
                  {(creatorId.name || 'A')[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-indigo-800">
                {creatorId.name || creatorId.username || 'Anonymous'}
              </p>
              {creatorId.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {creatorId.description}
                </p>
              )}
            </div>
          </Link>
        </div>
        
        {/* Participants */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-indigo-950">Участники</h2>
            <div className="flex items-center text-indigo-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{participants.length}</span>
            </div>
          </div>
          
          <Suspense fallback={<div className="h-12 w-full bg-gray-100 animate-pulse rounded-md"></div>}>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {participants.map(user => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-600 font-medium">
                        {(user.name || 'A')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <Link 
                      href={`/user/${user.username || user.id}`}
                      className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
                    >
                      {user.name || user.username || 'Anonymous'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
} 