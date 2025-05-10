"use client"

import { useMemo } from "react"
import StartupCard from "./StartupCard"
import { Pagination } from "@/components/ui/pagination"

interface StartupGridProps {
  startups: any[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
  baseUrl: string
}

export default function StartupGrid({ startups, pagination, baseUrl }: StartupGridProps) {
  // Use useMemo to memoize the empty state to prevent re-rendering when props don't change
  const emptyState = useMemo(() => (
    <div className="py-8 text-center">
      <h3 className="text-lg font-medium text-gray-900">
        Стартапы не найдены
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Пока нет стартапов в системе. Будьте первым, кто создаст стартап!
      </p>
    </div>
  ), []);
  
  // Memoize the startup cards to prevent re-renders unless startups change
  const startupCards = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  ), [startups]);
  
  if (startups.length === 0) {
    return emptyState;
  }
  
  return (
    <div className="space-y-6">
      {startupCards}
      
      <Pagination 
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        baseUrl={baseUrl}
        className="mt-8"
      />
    </div>
  )
} 