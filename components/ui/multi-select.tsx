"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type Option = {
  id: number
  name: string
}

interface MultiSelectProps {
  options: Option[]
  selectedValues: Option[]
  onChange: (selected: Option[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const toggleOption = (option: Option) => {
    if (disabled) return
    
    const isSelected = selectedValues.some((item) => item.id === option.id)
    
    if (isSelected) {
      onChange(selectedValues.filter((item) => item.id !== option.id))
    } else {
      onChange([...selectedValues, option])
    }
  }

  const removeOption = (option: Option) => {
    if (disabled) return
    onChange(selectedValues.filter((item) => item.id !== option.id))
  }

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative", 
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          !disabled && "cursor-pointer"
        )}
      >
        {selectedValues.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
              >
                {option.name}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeOption(option)
                    }}
                    className="ml-1 text-indigo-500 hover:text-indigo-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background py-1 shadow-lg">
          {options.map((option) => {
            const isSelected = selectedValues.some((item) => item.id === option.id)
            
            return (
              <div
                key={option.id}
                onClick={() => toggleOption(option)}
                className={cn(
                  "flex cursor-pointer items-center px-3 py-2 hover:bg-indigo-50",
                  isSelected && "bg-indigo-100"
                )}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                    isSelected 
                      ? "border-indigo-500 bg-indigo-500 text-white" 
                      : "border-gray-300"
                  )}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>{option.name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 