"use server";

import { getUser } from "@/data/user";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/landing/Header";
import { getSession } from "@/lib/getSession";

interface Tag {
  id: number;
  name: string;
}

interface Startup {
  id: string;
  name: string;
  description: string;
  image?: string | null;
}

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

  return (
    <div className="bg-indigo-950 min-h-screen">
      <Header session={session} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header section with user info */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-white h-18 relative"></div>
          <div className="px-6 py-6 relative">
            <div className="absolute -top-16 left-6 border-4 border-white rounded-full overflow-hidden bg-indigo-400 shadow-lg">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={128}
                  height={128}
                  className="h-32 w-32 object-cover"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-4xl font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            <div className="mt-16">
              <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
              <p className="text-gray-500">@{user.username || "username"}</p>
              <p className="mt-4 text-gray-700">
                {user.description || "Нет описания"}
              </p>

              {user.tags && user.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {user.tags.map((tag: Tag) => (
                    <span
                      key={tag.id}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Startups created section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Созданные стартапы</h2>
            {user.createdStartups && user.createdStartups.length > 0 ? (
              <div className="space-y-4">
                {user.createdStartups.map((startup: Startup) => (
                  <Link
                    href={`/startup/${startup.id}`}
                    key={startup.id}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      {startup.image ? (
                        <Image
                          src={startup.image}
                          alt={startup.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-indigo-100 rounded-md flex items-center justify-center">
                          <span className="text-indigo-800 font-semibold">
                            {startup.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {startup.name}
                        </h3>
                        <p className="text-gray-500 line-clamp-1">
                          {startup.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                На данный момент не создано стартапов
              </p>
            )}
          </div>

          {/* Participating startups section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Учавствующие стартапы</h2>
            {user.participatingStartups &&
            user.participatingStartups.length > 0 ? (
              <div className="space-y-4">
                {user.participatingStartups.map((startup: Startup) => (
                  <Link
                    href={`/startup/${startup.id}`}
                    key={startup.id}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      {startup.image ? (
                        <Image
                          src={startup.image}
                          alt={startup.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-indigo-100 rounded-md flex items-center justify-center">
                          <span className="text-indigo-800 font-semibold">
                            {startup.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {startup.name}
                        </h3>
                        <p className="text-gray-500 line-clamp-1">
                          {startup.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                На данный момент не участвует в стартапах
              </p>
            )}
          </div>
        </div>

        {/* User stats section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="text-indigo-600">Учавствует в</div>
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
        </div>
      </div>
    </div>
  );
}
