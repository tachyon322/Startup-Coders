"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PaginationProps {
  totalPages: number
  currentPage: number
  baseUrl: string
  className?: string
}

export function Pagination({ 
  totalPages, 
  currentPage, 
  baseUrl, 
  className 
}: PaginationProps) {
  // Don't render pagination if there's only 1 page
  if (totalPages <= 1) return null

  // Helper to generate href for a specific page
  const getPageHref = (page: number) => {
    const url = new URL(baseUrl, "http://localhost")
    url.searchParams.set("page", page.toString())
    return `${url.pathname}${url.search}`
  }

  // Helper to determine what page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = []
    
    // Always show the first page
    pageNumbers.push(1)
    
    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)
    
    // Ensure at least 3 pages in the middle if possible
    if (rangeEnd - rangeStart < 2) {
      if (rangeStart === 2) {
        rangeEnd = Math.min(totalPages - 1, rangeEnd + 1)
      } else if (rangeEnd === totalPages - 1) {
        rangeStart = Math.max(2, rangeStart - 1)
      }
    }
    
    // Add ellipsis if there's a gap after page 1
    if (rangeStart > 2) {
      pageNumbers.push(-1) // -1 represents ellipsis
    }
    
    // Add the range of pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i)
    }
    
    // Add ellipsis if there's a gap before the last page
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push(-2) // -2 represents ellipsis (using different key from first one)
    }
    
    // Always show the last page if it's not page 1
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className={cn("flex justify-center items-center space-x-2", className)}
      aria-label="Pagination"
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageHref(currentPage - 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-sm text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
          aria-disabled="true"
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNumber, index) => {
          // If it's an ellipsis
          if (pageNumber === -1 || pageNumber === -2) {
            return (
              <span
                key={`ellipsis-${pageNumber}`}
                className="inline-flex items-center justify-center h-8 px-2 text-sm text-gray-500"
              >
                ...
              </span>
            )
          }
          
          // Regular page number
          return (
            <Link
              key={`page-${pageNumber}`}
              href={getPageHref(pageNumber)}
              className={cn(
                "inline-flex items-center justify-center h-8 min-w-[2rem] rounded-md text-sm",
                pageNumber === currentPage
                  ? "bg-indigo-600 text-white font-medium"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              )}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          )
        })}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageHref(currentPage + 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-sm text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
          aria-disabled="true"
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
} 