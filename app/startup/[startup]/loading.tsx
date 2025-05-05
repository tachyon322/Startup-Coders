import React from "react";
import Header from "@/components/landing/Header";

const StartupLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={null} />
      <main className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left card (bigger) */}
          <div className="bg-gray-50 rounded-xs overflow-hidden md:w-2/3">
            <div className="p-6">
              {/* Title skeleton */}
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
              
              {/* Description skeletons */}
              <div className="space-y-4 mb-6">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Image gallery skeleton */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              
              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right card */}
          <div className="md:w-1/3">
            <div className="bg-gray-50 rounded-xs overflow-hidden">
              {/* Join button skeleton */}
              <div className="p-6">
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Creator skeleton */}
              <div className="p-6 border-t border-gray-100">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Participants skeleton */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartupLoading; 