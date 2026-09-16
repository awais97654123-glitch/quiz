'use client';

import { useEffect, useState, useCallback } from 'react';

export interface AppUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  institutionType?: string;
  institutionName?: string;
  codingLevel?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    username?: string;
    avatar_url?: string;
    institution_type?: string;
    institution_name?: string;
    coding_level?: string;
  };
}

export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json().catch(() => ({ user: null }));
      if (data?.user) {
        const u = data.user;
        const normalizedUser: AppUser = {
          id: u.userId,
          userId: u.userId,
          name: u.name,
          email: u.email,
          username: u.username,
          avatar: u.avatar,
          institutionType: u.institutionType,
          institutionName: u.institutionName,
          codingLevel: u.codingLevel,
          user_metadata: {
            full_name: u.name,
            name: u.name,
            username: u.username,
            avatar_url: u.avatar,
            institution_type: u.institutionType,
            institution_name: u.institutionName,
            coding_level: u.codingLevel,
          },
        };
        setUser(normalizedUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener('focus', handleAuthChange);
    window.addEventListener('cq-auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('focus', handleAuthChange);
      window.removeEventListener('cq-auth-change', handleAuthChange);
    };
  }, [fetchUser]);

  return {
    user,
    isLoaded,
    isSignedIn: !isLoaded ? false : !!user,
    refreshUser: fetchUser,
  };
}
