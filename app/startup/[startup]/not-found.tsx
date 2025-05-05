import React from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import { getSession } from "@/lib/getSession";

export default async function NotFound() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <div className="max-w-6xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold text-indigo-950 mb-4">Startup Not Found</h2>
        <p className="text-gray-600 mb-8">
          The startup you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 