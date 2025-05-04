"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-background border",
        success: "bg-green-50 border-green-200 text-green-800",
        destructive: "border-red-200 bg-red-50 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  visible: boolean
  onClose: () => void
}

export function Toast({
  className,
  variant,
  visible,
  onClose,
  children,
  ...props
}: ToastProps) {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!visible) return null
  
  return (
    <div
      className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-2"
      {...props}
    >
      <div className={cn(toastVariants({ variant, className }))}>
        <div className="flex-1">{children}</div>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 