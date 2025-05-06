"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PaginationProps {
  totalPages: number
  currentPage: number
  baseUrl: string
  className?: string
}

export function Pagination({ totalPages, currentPage, baseUrl, className }: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    // Current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pages[pages.length - 1] !== i - 1) {
        pages.push(-1) // Ellipsis
      }
      pages.push(i)
    }
    
    // Always show last page
    if (totalPages > 1) {
      if (pages[pages.length - 1] !== totalPages - 1) {
        pages.push(-1) // Ellipsis
      }
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = generatePageNumbers()

  return (
    <nav className={cn("flex justify-center items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <Link 
          href={`${baseUrl}?page=${Math.max(1, currentPage - 1)}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      
      {pageNumbers.map((page, index) => {
        // Render ellipsis
        if (page === -1) {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          )
        }
        
        // Render page number
        const isActive = page === currentPage
        
        return (
          <Button
            key={`page-${page}`}
            variant={isActive ? "default" : "outline"}
            size="icon"
            asChild={!isActive}
            className={cn(
              "h-8 w-8",
              isActive && "pointer-events-none"
            )}
          >
            {isActive ? (
              <span>{page}</span>
            ) : (
              <Link href={`${baseUrl}?page=${page}`}>
                {page}
              </Link>
            )}
          </Button>
        )
      })}
      
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <Link 
          href={`${baseUrl}?page=${Math.min(totalPages, currentPage + 1)}`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  )
} 