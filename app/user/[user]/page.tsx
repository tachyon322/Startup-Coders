"use server";

import { getUser, getMostActiveUsers } from "@/data/user";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import { getSession } from "@/lib/auth/getSession";
import { UserDescriptionSection } from "@/components/user/UserDescriptionSection";
import { UserTagsSection } from "@/components/user/UserTagsSection";
import { UserUsernameSection } from "@/components/user/UserUsernameSection";
import { UserNameSection } from "@/components/user/UserNameSection";
import { UserImageSection } from "@/components/user/UserImageSection";
import UserStartupTabs from "@/components/user/UserStartupTabs";
import { Metadata } from "next";
import { Suspense } from "react";

interface UserPageProps {
  params: Promise<{ user: string }>;
}

// Generate static params for most active users
export async function generateStaticParams() {
  // This function should return a list of usernames for the most active users
  // that we want to pre-render at build time
  const activeUsers = await getMostActiveUsers(20); // Get top 20 most active users
  
  // Filter out users with null usernames and map to the required format
  return activeUsers
    .filter((user) => user.username !== null)
    .map((user) => ({
      user: user.username as string,
    }));
}

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ user: string }> 
}): Promise<Metadata> {
  const userName = (await params).user;
  const user = await getUser(userName);
  
  if (!user) {
    return {
      title: 'Пользователь не найден',
    };
  }
  
  return {
    title: `${user.name || user.username || "User"} | Профиль`,
    description: user.description || `View ${user.name || user.username}'s profile`,
  };
}

// Preloaded profile skeleton to reduce layout shift
const ProfileSkeleton = () => (
  <>
    <div className="flex-shrink-0">
      <div className="h-32 w-32 rounded-full bg-gray-100 animate-pulse"></div>
    </div>
    <div className="flex-grow">
      <div className="h-10 w-full bg-gray-100 animate-pulse rounded mb-2"></div>
      <div className="h-6 w-full bg-gray-100 animate-pulse rounded my-1"></div>
      <div className="h-16 w-full bg-gray-100 animate-pulse rounded my-4"></div>
      <div className="h-10 w-full bg-gray-100 animate-pulse rounded my-4"></div>
    </div>
  </>
);

// Reusable stat box component to reduce duplication
const StatBox = ({ value, label }: { value: number | string; label: string }) => (
  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
    <div className="text-3xl font-bold text-indigo-800">{value}</div>
    <div className="text-indigo-600">{label}</div>
  </div>
);

export default async function UserPage({ params }: UserPageProps) {
  const userName = (await params).user;
  const user = await getUser(userName);

  if (!user) {
    notFound();
  }

  const session = await getSession();
  const isCurrentUser = session?.user?.username === user.username || session?.user?.id === user.id;

  // Precompute values to avoid unnecessary calculations in JSX
  const createdStartupsCount = user.createdStartups?.length || 0;
  const participatingStartupsCount = user.participatingStartups?.length || 0;
  const tagsCount = user.tags?.length || 0;
  const joinYear = new Date(user.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main profile panel */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          {/* User info section */}
          <div className="flex flex-col md:flex-row gap-6">
            <Suspense fallback={<ProfileSkeleton />}>
              {/* Avatar */}
              <div className="flex-shrink-0">
                <UserImageSection
                  image={user.image}
                  name={user.name}
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
              </div>
              
              {/* User details */}
              <div className="flex-grow">
                <UserNameSection
                  name={user.name}
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
                
                <UserUsernameSection
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
                
                <UserDescriptionSection 
                  description={user.description} 
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
                
                <UserTagsSection
                  tags={user.tags || []}
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
              </div>
            </Suspense>
          </div>
          
          {/* User stats section */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox value={createdStartupsCount} label="Стартапов создано" />
            <StatBox value={participatingStartupsCount} label="Участвует в" />
            <StatBox value={tagsCount} label="Скиллы" />
            <StatBox value={joinYear} label="Присоединился" />
          </div>
          
          {/* Startups tabs section */}
          <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded mt-8"></div>}>
            <UserStartupTabs 
              username={user.username || ''} 
              userId={user.id}
              createdStartups={user.createdStartups || []}
              participatingStartups={user.participatingStartups || []}
              isCurrentUser={isCurrentUser}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
