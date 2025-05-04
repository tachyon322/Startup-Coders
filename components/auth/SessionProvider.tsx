"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Session } from "../../types/base";

// Create a context for the session
const SessionContext = createContext<Session | null>(null);

interface SessionProviderProps {
  children: ReactNode;
  session: Session | null;
}

/**
 * Session provider component to expose session data to child components
 */
export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Hook to use the session in client components
 */
export function useSession() {
  const session = useContext(SessionContext);
  return session;
}

/**
 * Utility hook to check if the user is authenticated
 */
export function useIsAuthenticated() {
  const session = useSession();
  return !!session;
}

/**
 * Utility hook to get the current user
 */
export function useUser() {
  const session = useSession();
  return session?.user ?? null;
} 