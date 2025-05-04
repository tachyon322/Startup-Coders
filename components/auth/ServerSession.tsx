"use server";

import { ReactNode } from "react";
import { getSession } from "@/lib/getSession";
import { SessionProvider } from "./SessionProvider";

interface ServerSessionProviderProps {
  children: ReactNode;
}

/**
 * Server session provider that fetches the session and provides it to client components
 */
export async function ServerSessionProvider({ children }: ServerSessionProviderProps) {
  const session = await getSession();
  
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

/**
 * Utility function to check if the user is authenticated on the server
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Utility function to get the current user on the server
 */
export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
} 