'use server';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from './auth';
import { recalculateUserStats } from './leaderboard';

export interface ChallengeUserSearchResult {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  institutionType: string | null;
  institutionName: string | null;
  codingLevel: string | null;
  totalScore: number;
  ratingPoints: number;
  quizzesWon: number;
  rankBadge: 'CHAMPION' | 'MASTER' | 'GRANDMASTER' | 'CONTENDER';
}

function computeFriendRankBadge(ratingPoints: number): 'CHAMPION' | 'MASTER' | 'GRANDMASTER' | 'CONTENDER' {
  if (ratingPoints >= 2200) return 'GRANDMASTER';
  if (ratingPoints >= 1800) return 'MASTER';
  if (ratingPoints >= 1400) return 'CHAMPION';
  return 'CONTENDER';
}

export interface ClientDuelQuestion {
  id: string;
  topic: string | null;
  question: string;
  options: string[];
  difficulty: string;
  codeSnippet: string | null;
}

export interface ChallengeMatchData {
  id: string;
  courseId: string;
  courseName: string;
  courseSlug: string;
  challengerId: string;
  challengerName: string;
  challengerUsername: string | null;
  challengerAvatar: string | null;
  opponentId: string;
  opponentName: string;
  opponentUsername: string | null;
  opponentAvatar: string | null;
  status: string;
  totalQuestions: number;
  timeLimitSec: number;
  isChallenger: boolean;
  myQuestions: ClientDuelQuestion[];
  myResult: {
    score: number | null;
    correctCount: number | null;
    timeSec: number | null;
    completedAt: string | null;
  };
  opponentResult: {
    score: number | null;
    correctCount: number | null;
    timeSec: number | null;
    completedAt: string | null;
  };
  winnerId: string | null;
  createdAt: string;
}

/**
 * Helper to shuffle an array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Search friends by username or full name
 */
export async function searchFriendsByUsername(
  query: string
): Promise<ChallengeUserSearchResult[]> {
  try {
    const authUser = await getAuthUser();
    const cleanQuery = query.trim().toLowerCase().replace(/^@/, '');

    if (!cleanQuery || cleanQuery.length < 2) {
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: cleanQuery } },
              { name: { contains: cleanQuery } },
            ],
          },
          authUser ? { NOT: { clerkUserId: authUser.userId } } : {},
        ],
      },
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        username: true,
        avatar: true,
        institutionType: true,
        institutionName: true,
        codingLevel: true,
        totalScore: true,
        ratingPoints: true,
        quizzesWon: true,
      },
      take: 12,
    });

    return users.map((u) => ({
      id: u.clerkUserId,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      institutionType: u.institutionType,
      institutionName: u.institutionName,
      codingLevel: u.codingLevel,
      totalScore: u.totalScore || 0,
      ratingPoints: u.ratingPoints || 1000,
      quizzesWon: u.quizzesWon || 0,
      rankBadge: computeFriendRankBadge(u.ratingPoints || 1000),
    }));
  } catch (err) {
    console.error('Error searching friends:', err);
    return [];
  }
}

/**
 * Get recent opponents or suggested friends for quick 1v1 challenge
 */
export async function getRecentOrSuggestedFriends(): Promise<ChallengeUserSearchResult[]> {
  try {
    const authUser = await getAuthUser();
    const currentClerkId = authUser?.userId || '';

    // First find users from recent challenges
    const recentDuels = await prisma.friendChallenge.findMany({
      where: {
        OR: [
          { challengerId: currentClerkId },
          { opponentId: currentClerkId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        challengerId: true,
        opponentId: true,
      },
    });

    const recentOpponentIds = new Set<string>();
    for (const d of recentDuels) {
      if (d.challengerId && d.challengerId !== currentClerkId) {
        recentOpponentIds.add(d.challengerId);
      }
      if (d.opponentId && d.opponentId !== currentClerkId) {
        recentOpponentIds.add(d.opponentId);
      }
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          currentClerkId ? { NOT: { clerkUserId: currentClerkId } } : {},
          { username: { not: null } },
        ],
      },
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        username: true,
        avatar: true,
        institutionType: true,
        institutionName: true,
        codingLevel: true,
        totalScore: true,
        ratingPoints: true,
        quizzesWon: true,
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => ({
      id: u.clerkUserId,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      institutionType: u.institutionType,
      institutionName: u.institutionName,
      codingLevel: u.codingLevel,
      totalScore: u.totalScore || 0,
      ratingPoints: u.ratingPoints || 1000,
      quizzesWon: u.quizzesWon || 0,
      rankBadge: computeFriendRankBadge(u.ratingPoints || 1000),
    }));
  } catch (err) {
    console.error('Error getting suggested friends:', err);
    return [];
  }
}

/**
 * Get courses available for challenge duel
 */
export async function getChallengeCourses() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        color: true,
        badge: true,
        description: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return courses.filter((c) => c._count.questions >= 3);
  } catch (err) {
    console.error('Error fetching challenge courses:', err);
    return [];
  }
}

/**
 * Create a 1v1 Friend Challenge
 */
export async function createFriendChallenge(params: {
  opponentUsername?: string;
  opponentId?: string;
  courseId: string;
  totalQuestions?: number;
  timeLimitSec?: number;
}) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return { success: false, error: 'You must be logged in to challenge a friend.' };
    }

    const cleanUsername = params.opponentUsername?.trim().toLowerCase().replace(/^@/, '');
    const opponent = params.opponentId
      ? await prisma.user.findFirst({
          where: { clerkUserId: params.opponentId },
        })
      : cleanUsername
      ? await prisma.user.findFirst({
          where: { username: { equals: cleanUsername } },
        })
      : null;

    if (!opponent) {
      return { success: false, error: 'Opponent was not found.' };
    }

    if (opponent.clerkUserId === authUser.userId) {
      return { success: false, error: 'You cannot challenge yourself to a duel!' };
    }

    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        questions: {
          select: { id: true },
        },
      },
    });

    if (!course || course.questions.length === 0) {
      return { success: false, error: 'Selected course has no questions available.' };
    }

    const questionCount = Math.min(
      params.totalQuestions || 10,
      course.questions.length
    );

    // As requested: Each player gets different randomized questions
    const allIds = course.questions.map((q) => q.id);
    const challengerQuestions = shuffleArray(allIds).slice(0, questionCount);
    const opponentQuestions = shuffleArray(allIds).slice(0, questionCount);

    const challenge = await prisma.friendChallenge.create({
      data: {
        courseId: course.id,
        challengerId: authUser.userId,
        challengerName: authUser.name,
        challengerUsername: authUser.username || null,
        challengerAvatar: authUser.avatar || null,
        opponentId: opponent.clerkUserId,
        opponentName: opponent.name || 'Friend',
        opponentUsername: opponent.username || null,
        opponentAvatar: opponent.avatar || null,
        status: 'PENDING',
        totalQuestions: questionCount,
        timeLimitSec: params.timeLimitSec || 300,
        challengerQuestionIds: JSON.stringify(challengerQuestions),
        opponentQuestionIds: JSON.stringify(opponentQuestions),
      },
    });

    // Silently send Duel Challenge Email via Resend in the background
    if (opponent.email) {
      const { sendChallengeRequestEmail } = await import('@/lib/email');
      void sendChallengeRequestEmail({
        to: opponent.email,
        recipientName: opponent.name || opponent.username || 'Coder',
        challengerName: authUser.name,
        challengerUsername: authUser.username,
        courseName: course.name,
      }).catch((err) => console.error('[Resend Duel Challenge Silent Error]', err));
    }

    return {
      success: true,
      challengeId: challenge.id,
      courseName: course.name,
      opponentName: opponent.name || opponent.username,
      opponentId: opponent.clerkUserId,
    };
  } catch (err: any) {
    console.error('Error creating friend challenge:', err);
    return { success: false, error: err.message || 'Failed to create challenge.' };
  }
}

/**
 * Respond to Challenge (Accept or Reject)
 */
export async function respondToChallenge(params: {
  challengeId: string;
  action: 'ACCEPT' | 'REJECT';
}) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return { success: false, error: 'Unauthorized.' };
    }

    const challenge = await prisma.friendChallenge.findUnique({
      where: { id: params.challengeId },
    });

    if (!challenge) {
      return { success: false, error: 'Challenge duel not found.' };
    }

    if (challenge.opponentId !== authUser.userId) {
      return { success: false, error: 'You are not authorized to respond to this challenge.' };
    }

    const newStatus = params.action === 'ACCEPT' ? 'PLAYING' : 'REJECTED';

    const updated = await prisma.friendChallenge.update({
      where: { id: params.challengeId },
      data: {
        status: newStatus,
      },
    });

    return { success: true, status: updated.status, challengeId: updated.id };
  } catch (err: any) {
    console.error('Error responding to challenge:', err);
    return { success: false, error: err.message || 'Failed to update challenge.' };
  }
}

/**
 * Get full match data and client questions for current player
 */
export async function getChallengeMatch(challengeId: string): Promise<{
  success: boolean;
  data?: ChallengeMatchData;
  error?: string;
}> {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return { success: false, error: 'Unauthorized.' };
    }

    const challenge = await prisma.friendChallenge.findUnique({
      where: { id: challengeId },
      include: {
        course: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!challenge) {
      return { success: false, error: 'Challenge match not found.' };
    }

    const isChallenger = challenge.challengerId === authUser.userId;
    const isOpponent = challenge.opponentId === authUser.userId;

    if (!isChallenger && !isOpponent) {
      return { success: false, error: 'You are not a participant in this duel.' };
    }

    // Parse question IDs for the current player
    const questionIdsJson = isChallenger
      ? challenge.challengerQuestionIds
      : challenge.opponentQuestionIds;

    let questionIds: string[] = [];
    try {
      questionIds = JSON.parse(questionIdsJson || '[]');
    } catch {
      questionIds = [];
    }

    // Fetch the client question objects
    const dbQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    const questionMap = new Map(dbQuestions.map((q) => [q.id, q]));
    const orderedQuestions: ClientDuelQuestion[] = [];

    for (const qid of questionIds) {
      const q = questionMap.get(qid);
      if (!q) continue;

      let parsedOptions: string[] = [];
      try {
        parsedOptions = JSON.parse(q.options);
      } catch {
        parsedOptions = [q.options];
      }

      orderedQuestions.push({
        id: q.id,
        topic: q.topic,
        question: q.question,
        options: parsedOptions,
        difficulty: q.difficulty,
        codeSnippet: q.codeSnippet,
      });
    }

    const myResult = isChallenger
      ? {
          score: challenge.challengerScore,
          correctCount: challenge.challengerCorrectCount,
          timeSec: challenge.challengerTimeSec,
          completedAt: challenge.challengerCompletedAt?.toISOString() || null,
        }
      : {
          score: challenge.opponentScore,
          correctCount: challenge.opponentCorrectCount,
          timeSec: challenge.opponentTimeSec,
          completedAt: challenge.opponentCompletedAt?.toISOString() || null,
        };

    const opponentResult = isChallenger
      ? {
          score: challenge.opponentScore,
          correctCount: challenge.opponentCorrectCount,
          timeSec: challenge.opponentTimeSec,
          completedAt: challenge.opponentCompletedAt?.toISOString() || null,
        }
      : {
          score: challenge.challengerScore,
          correctCount: challenge.challengerCorrectCount,
          timeSec: challenge.challengerTimeSec,
          completedAt: challenge.challengerCompletedAt?.toISOString() || null,
        };

    return {
      success: true,
      data: {
        id: challenge.id,
        courseId: challenge.courseId,
        courseName: challenge.course.name,
        courseSlug: challenge.course.slug,
        challengerId: challenge.challengerId,
        challengerName: challenge.challengerName,
        challengerUsername: challenge.challengerUsername,
        challengerAvatar: challenge.challengerAvatar,
        opponentId: challenge.opponentId,
        opponentName: challenge.opponentName,
        opponentUsername: challenge.opponentUsername,
        opponentAvatar: challenge.opponentAvatar,
        status: challenge.status,
        totalQuestions: challenge.totalQuestions,
        timeLimitSec: challenge.timeLimitSec,
        isChallenger,
        myQuestions: orderedQuestions,
        myResult,
        opponentResult,
        winnerId: challenge.winnerId,
        createdAt: challenge.createdAt.toISOString(),
      },
    };
  } catch (err: any) {
    console.error('Error fetching challenge match:', err);
    return { success: false, error: err.message || 'Failed to load challenge match.' };
  }
}

/**
 * Submit challenge battle answers and evaluate winner
 */
export async function submitChallengeAnswers(params: {
  challengeId: string;
  answers: { questionId: string; selectedOption: number }[];
  timeTakenSec: number;
}) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return { success: false, error: 'Unauthorized.' };
    }

    const challenge = await prisma.friendChallenge.findUnique({
      where: { id: params.challengeId },
    });

    if (!challenge) {
      return { success: false, error: 'Challenge match not found.' };
    }

    const isChallenger = challenge.challengerId === authUser.userId;
    const isOpponent = challenge.opponentId === authUser.userId;

    if (!isChallenger && !isOpponent) {
      return { success: false, error: 'Unauthorized participant.' };
    }

    // Evaluate answers
    const questionIds = params.answers.map((a) => a.questionId);
    const dbQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, correctAnswer: true },
    });

    const correctMap = new Map(dbQuestions.map((q) => [q.id, q.correctAnswer]));
    let correctCount = 0;

    for (const ans of params.answers) {
      const correctIdx = correctMap.get(ans.questionId);
      if (correctIdx !== undefined && correctIdx === ans.selectedOption) {
        correctCount++;
      }
    }

    const totalQuestions = challenge.totalQuestions || params.answers.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const now = new Date();

    // Prepare updates
    const updates: Record<string, any> = {};
    if (isChallenger) {
      updates.challengerScore = score;
      updates.challengerCorrectCount = correctCount;
      updates.challengerTimeSec = params.timeTakenSec;
      updates.challengerCompletedAt = now;
    } else {
      updates.opponentScore = score;
      updates.opponentCorrectCount = correctCount;
      updates.opponentTimeSec = params.timeTakenSec;
      updates.opponentCompletedAt = now;
    }

    // Check if other player has already submitted
    const otherCompleted = isChallenger
      ? !!challenge.opponentCompletedAt
      : !!challenge.challengerCompletedAt;

    if (otherCompleted) {
      // Both finished! Determine winner:
      // "jo user kam time me zyada correct quest submite kare wo winner hu ga"
      const p1Correct = isChallenger ? correctCount : (challenge.challengerCorrectCount ?? 0);
      const p1Time = isChallenger ? params.timeTakenSec : (challenge.challengerTimeSec ?? 9999);
      const p1Id = challenge.challengerId;

      const p2Correct = !isChallenger ? correctCount : (challenge.opponentCorrectCount ?? 0);
      const p2Time = !isChallenger ? params.timeTakenSec : (challenge.opponentTimeSec ?? 9999);
      const p2Id = challenge.opponentId;

      let winnerId: string = 'DRAW';

      if (p1Correct > p2Correct) {
        winnerId = p1Id;
      } else if (p2Correct > p1Correct) {
        winnerId = p2Id;
      } else {
        // Equal scores: Tie-breaker is lower elapsed time
        if (p1Time < p2Time) {
          winnerId = p1Id;
        } else if (p2Time < p1Time) {
          winnerId = p2Id;
        } else {
          winnerId = 'DRAW';
        }
      }

      updates.status = 'COMPLETED';
      updates.winnerId = winnerId;
    }

    const finalMatch = await prisma.friendChallenge.update({
      where: { id: params.challengeId },
      data: updates,
    });

    // Recalculate stats for live leaderboard & profile analytics
    if (finalMatch.status === 'COMPLETED') {
      recalculateUserStats(finalMatch.challengerId).catch(() => {});
      recalculateUserStats(finalMatch.opponentId).catch(() => {});
    } else {
      recalculateUserStats(authUser.userId).catch(() => {});
    }

    return {
      success: true,
      score,
      correctCount,
      totalQuestions,
      timeTakenSec: params.timeTakenSec,
      isMatchCompleted: finalMatch.status === 'COMPLETED',
      winnerId: finalMatch.winnerId,
    };
  } catch (err: any) {
    console.error('Error submitting challenge answers:', err);
    return { success: false, error: err.message || 'Failed to submit duel score.' };
  }
}

/**
 * Get pending challenges and active duels for current user
 */
export async function getUserChallenges() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return { incomingPending: [], outgoingPending: [], recentCompleted: [] };
    }

    const [incomingPending, outgoingPending, recentCompleted] = await Promise.all([
      prisma.friendChallenge.findMany({
        where: {
          opponentId: authUser.userId,
          status: 'PENDING',
        },
        include: {
          course: { select: { name: true, slug: true, icon: true, color: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.friendChallenge.findMany({
        where: {
          challengerId: authUser.userId,
          status: 'PENDING',
        },
        include: {
          course: { select: { name: true, slug: true, icon: true, color: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.friendChallenge.findMany({
        where: {
          OR: [{ challengerId: authUser.userId }, { opponentId: authUser.userId }],
          status: { in: ['COMPLETED', 'PLAYING'] },
        },
        include: {
          course: { select: { name: true, slug: true, icon: true, color: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 8,
      }),
    ]);

    return {
      incomingPending,
      outgoingPending,
      recentCompleted,
    };
  } catch (err) {
    console.error('Error getting user challenges:', err);
    return { incomingPending: [], outgoingPending: [], recentCompleted: [] };
  }
}
