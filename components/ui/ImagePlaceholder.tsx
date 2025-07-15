"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImagePlaceholderProps {
  src?: string | null;
  alt: string;
  fallbackText?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "square" | "circle";
  className?: string;
  showSkeleton?: boolean;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs", 
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-xl",
  "2xl": "w-32 h-32 text-2xl"
};

const sizeDimensions = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
  "2xl": 128
};

export default function ImagePlaceholder({
  src,
  alt,
  fallbackText,
  size = "md",
  shape = "circle",
  className,
  showSkeleton = false,
  priority = false,
  quality = 90,
  onLoad,
  onError
}: ImagePlaceholderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setHasError(false);
      setImageLoaded(false);
    } else {
      setIsLoading(false);
      setHasError(false);
      setImageLoaded(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageLoaded(false);
    onError?.();
  };

  const getFallbackContent = () => {
    if (fallbackText) {
      return fallbackText.charAt(0).toUpperCase();
    }
    return <User className="w-1/2 h-1/2" />;
  };

  const baseClasses = cn(
    sizeClasses[size],
    shape === "circle" ? "rounded-full" : "rounded-lg",
    "relative overflow-hidden bg-indigo-100 flex items-center justify-center transition-all duration-200",
    className
  );

  const skeletonClasses = cn(
    baseClasses,
    "animate-pulse bg-gray-200"
  );

  const placeholderClasses = cn(
    baseClasses,
    "text-indigo-500 font-semibold"
  );

  // Show placeholder if no src
  if (!src) {
    return (
      <div
        className={placeholderClasses}
        role="img"
        aria-label={alt}
      >
        {getFallbackContent()}
      </div>
    );
  }

  // Show skeleton while loading if enabled and still loading
  if (isLoading && showSkeleton && !imageLoaded) {
    return (
      <div className={skeletonClasses} role="img" aria-label={`Loading ${alt}`}>
        <div className="w-full h-full bg-gray-300 animate-pulse" />
      </div>
    );
  }

  // Show placeholder if error occurred
  if (hasError) {
    return (
      <div
        className={placeholderClasses}
        role="img"
        aria-label={`Failed to load ${alt}`}
      >
        {getFallbackContent()}
      </div>
    );
  }

  // Show image with smooth transition
  return (
    <div className={baseClasses}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        priority={priority}
        quality={quality}
        sizes={`${sizeDimensions[size]}px`}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Show placeholder behind image while loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-indigo-500 font-semibold">
          {getFallbackContent()}
        </div>
      )}
    </div>
  );
}

// Specialized avatar component for user images
export interface UserAvatarPlaceholderProps extends Omit<ImagePlaceholderProps, 'fallbackText' | 'alt'> {
  user: {
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
  alt?: string;
}

export function UserAvatarPlaceholder({
  user,
  alt,
  ...props
}: UserAvatarPlaceholderProps) {
  const fallbackText = user.name || user.username || "U";
  const imageAlt = alt || user.name || user.username || "User avatar";

  return (
    <ImagePlaceholder
      src={user.image}
      alt={imageAlt}
      fallbackText={fallbackText}
      {...props}
    />
  );
}