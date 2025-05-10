import React from 'react';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/getSession';
import Header from '@/components/landing/Header';
import { getUserRequests } from '@/data/startup';
import Link from 'next/link';
import RequestCard from '@/components/startup/RequestCard';
import RequestActions from '@/components/startup/RequestActions';

export const metadata = {
  title: "Requests | Startup Match",
  description: "Manage your startup participation requests"
};

export default async function RequestsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    notFound();
  }
  
  try {
    const { incoming, outgoing } = await getUserRequests();

    return (
      <div className="min-h-screen bg-gray-50">
        <Header session={session} />
        
        <main className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-8">Requests</h1>
          
          <div className="space-y-8">
            {/* Incoming Requests */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                Incoming Requests
                {incoming.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full">
                    {incoming.length}
                  </span>
                )}
              </h2>
              
              {incoming.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No incoming requests yet
                </div>
              ) : (
                <div className="space-y-4">
                  {incoming.map((request: any) => {
                    // Get the first user from requestBy array
                    const requestUser = request.requestBy && request.requestBy[0];
                    
                    if (!requestUser || !request.startup) {
                      return null; // Skip invalid requests
                    }
                    
                    return (
                      <div key={String(request.id)} className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <RequestCard
                              requestId={String(request.id)}
                              startupName={request.startup.name}
                              startupId={request.startup.id}
                              userName={requestUser.name || "Anonymous"}
                              userId={requestUser.id || ""}
                              userImage={requestUser.image || undefined}
                              message={request.message}
                              date={request.createdAt}
                              type="incoming"
                            />
                          </div>
                          <div className="ml-4">
                            <RequestActions
                              requestId={String(request.id)}
                              startupId={request.startup.id}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Outgoing Requests */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                Your Requests
                {outgoing.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full">
                    {outgoing.length}
                  </span>
                )}
              </h2>
              
              {outgoing.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  <p className="mb-4">You haven't sent any requests yet</p>
                  <Link 
                    href="/find" 
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Find Startups
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoing.map((request: any) => {
                    if (!request.startup) {
                      return null; // Skip invalid requests
                    }
                    
                    return (
                      <div key={String(request.id)} className="bg-white rounded-lg shadow p-5">
                        <RequestCard
                          requestId={String(request.id)}
                          startupName={request.startup.name}
                          startupId={request.startup.id}
                          userName={session.user.name || "You"}
                          userId={session.user.id}
                          userImage={session.user.image || undefined}
                          message={request.message}
                          date={request.createdAt}
                          type="outgoing"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header session={session} />
        <main className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-8">Requests</h1>
          <div className="bg-white rounded-lg shadow p-6 text-center text-red-500">
            Error loading requests. Please try again later.
          </div>
        </main>
      </div>
    );
  }
}