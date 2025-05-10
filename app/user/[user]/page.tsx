"use server";

import { getUser, getMostActiveUsers } from "@/data/user";
import { notFound } from "next/navigation";
import Image from "next/image";
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

export default async function UserPage({ params }: UserPageProps) {
  const userName = (await params).user;
  const user = await getUser(userName);

  if (!user) {
    notFound();
  }

  const session = await getSession();
  const isCurrentUser = session?.user?.username === user.username || session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main profile panel */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          {/* User info section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Suspense fallback={<div className="h-32 w-32 rounded-full bg-gray-100 animate-pulse"></div>}>
                <UserImageSection
                  image={user.image}
                  name={user.name}
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
              </Suspense>
            </div>
            
            {/* User details */}
            <div className="flex-grow">
              <Suspense fallback={<div className="h-10 w-full bg-gray-100 animate-pulse rounded mb-2"></div>}>
                <UserNameSection
                  name={user.name}
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
              </Suspense>
              
              <Suspense fallback={<div className="h-6 w-full bg-gray-100 animate-pulse rounded my-1"></div>}>
                <UserUsernameSection
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
              </Suspense>
              
              <Suspense fallback={<div className="h-16 w-full bg-gray-100 animate-pulse rounded my-4"></div>}>
                <UserDescriptionSection 
                  description={user.description} 
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
              </Suspense>
              
              <Suspense fallback={<div className="h-10 w-full bg-gray-100 animate-pulse rounded my-4"></div>}>
                <UserTagsSection
                  tags={user.tags || []}
                  username={user.username}
                  userId={user.id}
                  isCurrentUser={isCurrentUser}
                />
              </Suspense>
            </div>
          </div>
          
          {/* User stats section */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-indigo-800">
                {user.createdStartups?.length || 0}
              </div>
              <div className="text-indigo-600">Стартапов создано</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-indigo-800">
                {user.participatingStartups?.length || 0}
              </div>
              <div className="text-indigo-600">Участвует в</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-indigo-800">
                {user.tags?.length || 0}
              </div>
              <div className="text-indigo-600">Скиллы</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-indigo-800">
                {new Date(user.createdAt).getFullYear()}
              </div>
              <div className="text-indigo-600">Присоединился</div>
            </div>
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
