'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { OnboardingModal } from './OnboardingModal';

export function OnboardingProvider() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    try {
      if (sessionStorage.getItem('cq_onboarding_dismissed') === 'true') {
        setDismissed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    let isMounted = true;

    const inspectUser = (authUser: SupabaseUser | null) => {
      if (!isMounted) return;
      setUser(authUser);

      if (authUser) {
        // If user is authenticated, check if onboarding is completed
        const isCompleted =
          authUser.user_metadata?.onboarding_completed === true &&
          !!authUser.user_metadata?.username &&
          !!authUser.user_metadata?.institution_name;

        setNeedsOnboarding(!isCompleted);
      } else {
        setNeedsOnboarding(false);
      }
      setChecked(true);
    };

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      inspectUser(user);
    });

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      inspectUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Don't interrupt login / auth callback routes or if dismissed
  if (!checked || !user || !needsOnboarding || dismissed) {
    return null;
  }

  if (pathname === '/login' || pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <OnboardingModal
      user={user}
      onCompleted={() => {
        setNeedsOnboarding(false);
        setDismissed(true);
        try {
          sessionStorage.setItem('cq_onboarding_dismissed', 'true');
        } catch {}
      }}
    />
  );
}
