import { redirect } from 'next/navigation';
import { getAuthUser } from '@/app/actions/auth';
import { getChallengeCourses, getUserChallenges, getRecentOrSuggestedFriends } from '@/app/actions/challenge';
import { ChallengeHub } from '@/components/ChallengeHub';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Friend Room 1v1 Duel | CodeQuiz Arena',
  description: '1v1 Realtime Developer Duel. Challenge friends in a 1v1 code duel by username.',
};

export const dynamic = 'force-dynamic';

export default async function ChallengeVsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login?redirect_url=/challenge-vs');
  }

  const [courses, { incomingPending, outgoingPending, recentCompleted }, suggestedFriends] =
    await Promise.all([
      getChallengeCourses(),
      getUserChallenges(),
      getRecentOrSuggestedFriends(),
    ]);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-start">
      <ChallengeHub
        courses={courses as any}
        initialPendingIncoming={incomingPending}
        initialPendingOutgoing={outgoingPending}
        initialRecentCompleted={recentCompleted}
        suggestedFriends={suggestedFriends}
      />
    </main>
  );
}
