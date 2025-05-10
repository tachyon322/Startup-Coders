"use server"

import { auth } from './auth';
import { headers } from 'next/headers';
import { cache } from 'react';
import type { Session } from '../../types/base';

/**
 * Utility function to get the user session
 * @returns The user session or null if not authenticated
 */
export const getSession = cache(async function getSession(): Promise<Session | null> {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    
    // Return null if no session exists
    if (!authSession) return null;
    
    // Convert the auth session to our Session type
    return {
      id: authSession.session.id,
      expiresAt: authSession.session.expiresAt,
      token: authSession.session.token,
      createdAt: authSession.session.createdAt,
      updatedAt: authSession.session.updatedAt,
      ipAddress: authSession.session.ipAddress ?? null,
      userAgent: authSession.session.userAgent ?? null,
      userId: authSession.session.userId,
      user: {
        id: authSession.user.id,
        username: authSession.user.username as string, // Add default null values for missing fields
        email: authSession.user.email,
        name: authSession.user.name ?? null,
        image: authSession.user.image ?? null,
        description: null, // Add default null value
        emailVerified: authSession.user.emailVerified
      }
    };
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
}); 