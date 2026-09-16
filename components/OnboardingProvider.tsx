'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/supabase/useUser';
import { OnboardingModal } from './OnboardingModal';

export function OnboardingProvider() {
  const { user, isLoaded, refreshUser } = useUser();
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (sessionStorage.getItem('cq_onboarding_dismissed') === 'true') {
        setDismissed(true);
      }
    } catch {}
  }, []);

  if (!isLoaded || !user || dismissed) {
    return null;
  }

  // Check if user has completed onboarding
  const isCompleted =
    Boolean(user.username) &&
    Boolean(user.institutionName || user.institutionType);

  if (isCompleted) {
    return null;
  }

  // Don't interrupt login / auth routes
  if (pathname === '/login' || pathname.startsWith('/sign-up') || pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <OnboardingModal
      user={user}
      onCompleted={() => {
        setDismissed(true);
        refreshUser();
        try {
          sessionStorage.setItem('cq_onboarding_dismissed', 'true');
        } catch {}
      }}
    />
  );
}
