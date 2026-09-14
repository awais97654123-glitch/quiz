import { getGlobalLeaderboard } from '@/app/actions/leaderboard';
import { InternationalLeaderboard } from '@/components/InternationalLeaderboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'International Global Leaderboard | CodeQuiz Hall of Fame',
  description: 'Live global developer rankings and hall of fame based on quiz accuracy, speed, and 1v1 match victories.',
};

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const { top10, currentUserRank, totalRankedPlayers } = await getGlobalLeaderboard();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-start">
      <InternationalLeaderboard
        initialTop10={top10}
        currentUserRank={currentUserRank}
        totalRankedPlayers={totalRankedPlayers}
      />
    </main>
  );
}
