import { redirect, notFound } from 'next/navigation';
import { getAuthUser } from '@/app/actions/auth';
import { getChallengeMatch } from '@/app/actions/challenge';
import { ChallengeBattleArena } from '@/components/ChallengeBattleArena';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '1v1 Code Duel Arena | CodeQuiz',
  description: 'Live 1v1 developer coding challenge match.',
};

export const dynamic = 'force-dynamic';

export default async function ChallengeArenaPage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const user = await getAuthUser();
  const { challengeId } = await params;

  if (!user) {
    redirect(`/login?redirect_url=/challenge-vs/${challengeId}`);
  }

  const res = await getChallengeMatch(challengeId);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full flex flex-col justify-start">
      <ChallengeBattleArena initialMatch={res.data} currentUserId={user.userId} />
    </main>
  );
}
