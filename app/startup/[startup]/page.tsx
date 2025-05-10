"use server";

import React from "react";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import { getStartupById, hasRequestedAccess } from "@/data/startup";
import { getSession } from "@/lib/auth/getSession";
import Image from "next/image";
import Link from "next/link";
import { Users, Calendar } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import RequestFormWrapper from "@/components/startup/RequestFormWrapper";

const StartupPage = async ({ params }: { params: Promise<{ startup: string }> }) => {
  const session = await getSession();
  const startupId = (await params).startup;
  
  const startup = await getStartupById(startupId);
  const hasRequested = session?.user?.id ? await hasRequestedAccess(startupId) : false;

  // If startup doesn't exist, show 404
  if (!startup) {
    notFound();
  }

  const isParticipant = session?.user?.id && startup.participants.some(p => p.id === session.user.id);
  const isCreator = session?.user?.id === startup.creatorUser;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <main className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <Link 
          href="/find" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6"
        >
          ← Вернуться к списку стартапов
        </Link>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left card (bigger) */}
          <div className="bg-gray-50 rounded-xs overflow-hidden md:w-2/3">
            {/* Startup info */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-indigo-950 mb-4">{startup.name}</h1>
              
              {/* Description */}
              <div className="prose max-w-none text-gray-700 mb-6">
                {startup.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* Image gallery with lightbox */}
              {startup.images && startup.images.length > 0 && (
                <ImageLightbox images={startup.images} maxDisplay={4} />
              )}
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {startup.tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right card */}
          <div className="md:w-1/3">
            <div className="bg-gray-50 rounded-xs overflow-hidden">
              {/* Join button or form */}
              <div className="p-6">
                {!session ? (
                  <Link 
                    href={`/login?returnTo=/startup/${startupId}`}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors inline-block text-center"
                  >
                    Войти для участия
                  </Link>
                ) : isCreator ? (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Вы создатель проекта
                  </button>
                ) : isParticipant ? (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Вы уже участник
                  </button>
                ) : hasRequested ? (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Заявка отправлена
                  </button>
                ) : (
                  <RequestFormWrapper startupId={startupId} />
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    <time dateTime={new Date(startup.createdAt).toISOString()}>
                      Создано {new Date(startup.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
              
              {/* Creator */}
              <div className="p-6 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-indigo-950 mb-4">Создатель</h2>
                <Link href={`/user/${startup.creatorId.username || startup.creatorId.id}`} className="flex items-start space-x-4">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                    {startup.creatorId.image ? (
                      <Image
                        src={startup.creatorId.image}
                        alt={startup.creatorId.name || 'Creator'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-600 font-medium text-lg">
                        {(startup.creatorId.name || 'A')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-indigo-800">
                      {startup.creatorId.name || startup.creatorId.username || 'Anonymous'}
                    </p>
                    {startup.creatorId.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {startup.creatorId.description}
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
                    <span>{startup.participants.length}</span>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {startup.participants.map(user => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            fill
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartupPage;
