"use server";

import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/landing/Header";
import { getStartupById, hasRequestedAccess } from "@/data/startup";
import { getSession } from "@/lib/auth/getSession";
import StartupHeader from "@/components/startup/StartupHeader";
import StartupImageGallery from "@/components/startup/StartupImageGallery";
import StartupSidebar from "@/components/startup/StartupSidebar";
import StartupActions from "@/components/startup/StartupActions";

// Loading state placeholder
function LoadingPlaceholder() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-gray-200 rounded-xs"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

// Server Component
export default async function StartupPage({ params }: { params: Promise<{ startup: string }> }) {
  const startupId = (await params).startup;
  
  // Parallel data fetching
  const [session, startup] = await Promise.all([
    getSession(),
    getStartupById(startupId)
  ]);
  
  // If startup doesn't exist, show 404
  if (!startup) {
    notFound();
  }
  
  // User state checks
  const isLoggedIn = !!session?.user?.id;
  const isParticipant = isLoggedIn && startup.participants.some(p => p.id === session.user.id);
  const isCreator = isLoggedIn && session.user.id === startup.creatorUser;
  
  // Only fetch request status if needed (user is logged in and not already a participant)
  let hasRequested = false;
  if (isLoggedIn && !isParticipant && !isCreator) {
    hasRequested = await hasRequestedAccess(startupId);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <main className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <Link 
          href="/find" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Вернуться к списку стартапов
        </Link>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left content area */}
          <div className="bg-gray-50 rounded-xs overflow-hidden md:w-2/3">
            <Suspense fallback={<LoadingPlaceholder />}>
              {/* Startup info */}
              <StartupHeader 
                name={startup.name} 
                tags={startup.tags}
                description={startup.description}
              />
              
              {/* Image gallery with lazy loaded images */}
              {startup.images && startup.images.length > 0 && (
                <StartupImageGallery images={startup.images} maxDisplay={4} />
              )}
            </Suspense>
          </div>
          
          {/* Right sidebar */}
          <StartupSidebar
            creatorId={startup.creatorId}
            participants={startup.participants}
            createdAt={startup.createdAt}
          >
            <StartupActions
              startupId={startupId}
              isLoggedIn={isLoggedIn}
              isCreator={isCreator}
              isParticipant={isParticipant}
              hasRequested={hasRequested}
            />
          </StartupSidebar>
        </div>
      </main>
    </div>
  );
}
