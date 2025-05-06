"use server";

import { getUser } from "@/data/user";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/landing/Header";
import { getSession } from "@/lib/getSession";
import { UserDescriptionSection } from "@/components/user/UserDescriptionSection";
import { UserTagsSection } from "@/components/user/UserTagsSection";
import UserProfileNav from "@/components/user/UserProfileNav";
import UserStartupTabs from "@/components/user/UserStartupTabs";

interface UserPageProps {
  params: Promise<{ user: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const userName = (await params).user;
  const user = await getUser(userName);

  if (!user) {
    notFound();
  }

  const session = await getSession();
  const isCurrentUser = session?.user?.username === user.username;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <UserProfileNav username={userName} activePath={`/user/${userName}`} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main profile panel */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          {/* User info section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative h-32 w-32 rounded-full overflow-hidden bg-indigo-100 border-4 border-white shadow-lg">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-indigo-500">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
            </div>
            
            {/* User details */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-indigo-950">{user.name || "User"}</h1>
              <p className="text-gray-500">@{user.username}</p>
              
              <UserDescriptionSection 
                description={user.description} 
                username={user.username} 
                isCurrentUser={isCurrentUser}
              />
              
              <UserTagsSection
                tags={user.tags || []}
                username={user.username}
                isCurrentUser={isCurrentUser}
              />
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
          <UserStartupTabs 
            username={user.username || ''} 
            createdStartups={user.createdStartups || []}
            participatingStartups={user.participatingStartups || []}
            isCurrentUser={isCurrentUser}
          />
        </div>
      </div>
    </div>
  );
}
