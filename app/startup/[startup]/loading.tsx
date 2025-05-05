import React from "react";
import Header from "@/components/landing/Header";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={null} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header section skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* Image skeleton */}
          <div className="relative h-80 md:h-96 bg-gray-200 animate-pulse" />

          {/* Title and metadata skeleton */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="h-10 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"
                />
              ))}
            </div>
          </div>
          
          {/* Creator info skeleton */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div>
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
                </div>
              </div>
              
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="h-7 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div 
                    key={i} 
                    className="h-5 bg-gray-200 rounded w-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-7 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-8 animate-pulse" />
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 