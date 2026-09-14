import { prisma } from '../lib/prisma';
import { getGlobalLeaderboard, getUserAnalytics } from '../app/actions/leaderboard';
import { getRecentOrSuggestedFriends } from '../app/actions/challenge';

async function main() {
  console.log('--- TESTING GLOBAL LEADERBOARD ---');
  const lb = await getGlobalLeaderboard();
  console.log('Total ranked players:', lb.totalRankedPlayers);
  console.log('Top 10 count:', lb.top10.length);
  lb.top10.forEach((u) => {
    console.log(`Rank #${u.rank}: ${u.name} (@${u.username}) | Score: ${u.totalScore} | RP: ${u.ratingPoints} | Effective: ${u.effectiveScore} | Active: ${u.isActive} | Badge: ${u.rankBadge} | Avatar: ${u.avatar ? 'YES' : 'NONE'}`);
  });

  console.log('\n--- TESTING SUGGESTED FRIENDS SEARCH ---');
  const friends = await getRecentOrSuggestedFriends();
  console.log('Suggested friends count:', friends.length);
  friends.slice(0, 3).forEach((f) => {
    console.log(`Friend: ${f.name} (@${f.username}) | Score: ${f.totalScore} | RP: ${f.ratingPoints} | Level: ${f.codingLevel} | Badge: ${f.rankBadge}`);
  });

  console.log('\n--- TESTING FIRST USER ANALYTICS RINGS ---');
  const firstUser = await prisma.user.findFirst();
  if (firstUser) {
    const analytics = await getUserAnalytics(firstUser.clerkUserId);
    console.log('Analytics for user:', firstUser.name, analytics);
  }

  console.log('\n--- ALL BACKEND CHECKS PASSED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
