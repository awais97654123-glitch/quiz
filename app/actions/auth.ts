'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  username?: string;
  institutionType?: string;
  institutionName?: string;
  codingLevel?: string;
  avatar?: string;
  provider: 'supabase';
}

const getCachedAuthUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const cookieStore = await cookies();
    const hasAuthCookie = cookieStore.getAll().some(
      (c) => c.name.includes('auth-token') || c.name.startsWith('sb-')
    );
    if (!hasAuthCookie) {
      return null; // Instant 0ms return for guest sessions!
    }

    const supabase = await createClient();

    // Fast 1.5s timeout guard to prevent slow remote Supabase network latency from hanging Next.js SSR
    const timeoutPromise = new Promise<{ data: { user: null }; error: any }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null }, error: new Error('Auth fetch timeout') }), 1500)
    );

    const {
      data: { user },
      error,
    } = await Promise.race([supabase.auth.getUser(), timeoutPromise]);

    if (error || !user) {
      return null;
    }

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Developer';

    return {
      userId: user.id,
      name: fullName,
      email: user.email || '',
      username: user.user_metadata?.username || undefined,
      institutionType: user.user_metadata?.institution_type || undefined,
      institutionName: user.user_metadata?.institution_name || undefined,
      codingLevel: user.user_metadata?.coding_level || undefined,
      avatar: user.user_metadata?.avatar_url || undefined,
      provider: 'supabase',
    };
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err;
    }
    console.error('Error in getAuthUser:', err);
    return null;
  }
});

/**
 * Get current authenticated user from Supabase (deduped per request lifecycle)
 */
export async function getAuthUser(): Promise<SessionUser | null> {
  return getCachedAuthUser();
}


/**
 * Log out user via Supabase
 */
export async function logoutUser() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    console.error('Error in logoutUser:', err);
    return { success: false };
  }
}
