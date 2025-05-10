"use server";

import React from "react";
import { Suspense } from "react";
import { cache } from "react";
import Header from "@/components/landing/Header";
import { getSession } from "@/lib/auth/getSession";
import { getStartups, getTags } from "@/data/startup";
import StartupGrid from "@/components/startup/StartupGrid";
import StartupSearch from "@/components/startup/StartupSearch";

interface FindPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    tags?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

const PAGE_SIZE = 9;

// Cached version of getTags to avoid redundant database calls
const getCachedTags = cache(async () => {
  return getTags();
});

// Cached version of getStartups with dependency on all search parameters
const getCachedStartups = cache(async (
  page: number,
  pageSize: number,
  searchQuery?: string,
  tagIds?: number[]
) => {
  return getStartups(page, pageSize, searchQuery, tagIds);
});

const FindPage = async ({ searchParams }: FindPageProps) => {
  const session = await getSession();
  const params = await searchParams;

  // Parse page from query params
  const page = parseInt((params.page as string) || "1", 10);

  // Get search query if any
  const searchQuery = params.q || undefined;

  // Parse tag IDs if any
  const tagIds = params.tags
    ? (params.tags as string).split(",").map((id) => parseInt(id, 10))
    : undefined;

  // Fetch all available tags for the filter component (cached)
  const tags = await getCachedTags();

  // Fetch startups with pagination, search and filters (cached)
  const { startups, pagination } = await getCachedStartups(
    page,
    PAGE_SIZE,
    searchQuery,
    tagIds
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-indigo-800 to-indigo-300 opacity-10"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          ></div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-6xl relative">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-indigo-950 sm:text-4xl">
                Найти стартап
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                Присоединяйтесь к интересным проектам или найдите членов команды
                для своей идеи
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <a
                href="/create"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Создать идею
              </a>
            </div>
          </div>
        </div>

        {/* Optimize with streaming and suspense boundaries */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse rounded-md">Загрузка фильтров...</div>}>
            <StartupSearch availableTags={tags} />
          </Suspense>
        </div>

        <Suspense fallback={<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>}>
          <StartupGrid
            startups={startups}
            pagination={pagination}
            baseUrl="/find"
          />
        </Suspense>
      </main>
    </div>
  );
};

export default FindPage;
