import { prisma } from '@/lib/prisma';
import { FALLBACK_COURSES } from '@/lib/courses-data';

let isSchemaEnsured = false;
let isInitializing = false;

const DDL_TABLES_SQL = `
-- CreateTable User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "name" TEXT,
    "username" TEXT,
    "institutionType" TEXT,
    "institutionName" TEXT,
    "codingLevel" TEXT,
    "avatar" TEXT,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "ratingPoints" INTEGER NOT NULL DEFAULT 1000,
    "quizzesPlayed" INTEGER NOT NULL DEFAULT 0,
    "quizzesWon" INTEGER NOT NULL DEFAULT 0,
    "averageAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageTimeSec" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable Course
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Code',
    "color" TEXT NOT NULL DEFAULT 'from-cyan-500 to-blue-600',
    "badge" TEXT DEFAULT 'Core',
    "topics" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable Question
CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "topic" TEXT,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctAnswer" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "codeSnippet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable QuizRoom
CREATE TABLE IF NOT EXISTS "QuizRoom" (
    "id" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "creatorClerkId" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "quizName" TEXT NOT NULL,
    "description" TEXT,
    "questionCount" INTEGER NOT NULL DEFAULT 10,
    "timeLimit" INTEGER NOT NULL DEFAULT 10,
    "difficulty" TEXT DEFAULT 'ALL',
    "instructions" TEXT,
    "questionIds" TEXT,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable QuizParticipant
CREATE TABLE IF NOT EXISTS "QuizParticipant" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userAvatar" TEXT,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "score" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "incorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "completionTimeSec" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    CONSTRAINT "QuizParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable QuizAnswer
CREATE TABLE IF NOT EXISTS "QuizAnswer" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable QuizActivity
CREATE TABLE IF NOT EXISTS "QuizActivity" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable SoloQuizAttempt
CREATE TABLE IF NOT EXISTS "SoloQuizAttempt" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "userName" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "quizName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "incorrectCount" INTEGER NOT NULL,
    "timeTakenSec" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SoloQuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable FriendChallenge
CREATE TABLE IF NOT EXISTS "FriendChallenge" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "challengerId" TEXT NOT NULL,
    "challengerName" TEXT NOT NULL,
    "challengerUsername" TEXT,
    "challengerAvatar" TEXT,
    "opponentId" TEXT NOT NULL,
    "opponentName" TEXT NOT NULL,
    "opponentUsername" TEXT,
    "opponentAvatar" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalQuestions" INTEGER NOT NULL DEFAULT 10,
    "timeLimitSec" INTEGER NOT NULL DEFAULT 300,
    "challengerScore" INTEGER,
    "challengerCorrectCount" INTEGER,
    "challengerTimeSec" INTEGER,
    "challengerCompletedAt" TIMESTAMP(3),
    "challengerQuestionIds" TEXT,
    "opponentScore" INTEGER,
    "opponentCorrectCount" INTEGER,
    "opponentTimeSec" INTEGER,
    "opponentCompletedAt" TIMESTAMP(3),
    "opponentQuestionIds" TEXT,
    "winnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FriendChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable EmailVerificationOtp
CREATE TABLE IF NOT EXISTS "EmailVerificationOtp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailVerificationOtp_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkUserId_key" ON "User"("clerkUserId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "Course_slug_key" ON "Course"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "QuizRoom_roomCode_key" ON "QuizRoom"("roomCode");
CREATE INDEX IF NOT EXISTS "QuizRoom_roomCode_idx" ON "QuizRoom"("roomCode");
CREATE INDEX IF NOT EXISTS "QuizRoom_status_idx" ON "QuizRoom"("status");
CREATE INDEX IF NOT EXISTS "QuizParticipant_roomId_idx" ON "QuizParticipant"("roomId");
CREATE UNIQUE INDEX IF NOT EXISTS "QuizParticipant_roomId_userId_key" ON "QuizParticipant"("roomId", "userId");
CREATE INDEX IF NOT EXISTS "FriendChallenge_challengerId_idx" ON "FriendChallenge"("challengerId");
CREATE INDEX IF NOT EXISTS "FriendChallenge_opponentId_idx" ON "FriendChallenge"("opponentId");
CREATE INDEX IF NOT EXISTS "FriendChallenge_status_idx" ON "FriendChallenge"("status");
CREATE INDEX IF NOT EXISTS "EmailVerificationOtp_email_idx" ON "EmailVerificationOtp"("email");
`;

/**
 * Ensures all required PostgreSQL database tables exist.
 * If tables do not exist (e.g. fresh database), it executes DDL statements on the fly.
 */
export async function ensureDatabaseSchema(): Promise<boolean> {
  if (isSchemaEnsured) return true;
  if (isInitializing) return false;

  isInitializing = true;
  try {
    // Check if User table exists
    const checkTable = (await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'User'
      LIMIT 1;
    `).catch(() => [])) as any[];

    if (!checkTable || checkTable.length === 0) {
      console.log('[DB-Init] Missing tables detected. Executing self-healing DDL statements...');
      // Split statements and execute sequentially
      const statements = DDL_TABLES_SQL
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 5);

      for (const stmt of statements) {
        try {
          await prisma.$executeRawUnsafe(stmt);
        } catch (stmtErr: any) {
          // Ignore index already exists or constraint already exists
          if (!stmtErr?.message?.includes('already exists')) {
            console.warn('[DB-Init] DDL execution notice:', stmtErr?.message);
          }
        }
      }
      console.log('[DB-Init] ✓ Self-healing DDL completed successfully.');
    }

    isSchemaEnsured = true;

    // Trigger non-blocking auto-seed for courses if empty
    seedCoursesIfEmpty().catch((err) => {
      console.error('[DB-Init] Background seed error:', err);
    });

    return true;
  } catch (err: any) {
    console.error('[DB-Init] Schema check warning:', err?.message || err);
    return false;
  } finally {
    isInitializing = false;
  }
}

/**
 * Automatically populates the Course and Question tables if empty.
 */
export async function seedCoursesIfEmpty(): Promise<void> {
  try {
    const courseCount = await prisma.course.count().catch(() => 0);
    if (courseCount >= 8) {
      return; // Already populated
    }

    console.log(`[DB-Init] Course count is ${courseCount}. Seeding 8 programming tracks...`);

    for (const courseData of FALLBACK_COURSES) {
      const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: {
          name: courseData.name,
          description: courseData.description,
          icon: courseData.icon,
          color: courseData.color,
          badge: courseData.badge,
          topics: JSON.stringify(courseData.topics),
        },
        create: {
          name: courseData.name,
          slug: courseData.slug,
          description: courseData.description,
          icon: courseData.icon,
          color: courseData.color,
          badge: courseData.badge,
          topics: JSON.stringify(courseData.topics),
        },
      });

      // Insert questions for this course
      if (courseData.questions && courseData.questions.length > 0) {
        const existingQuestionCount = await prisma.question.count({
          where: { courseId: course.id },
        });

        if (existingQuestionCount === 0) {
          await prisma.question.createMany({
            data: courseData.questions.map((q) => ({
              courseId: course.id,
              topic: q.topic,
              question: q.question,
              options: JSON.stringify(q.options),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: q.difficulty,
            })),
          });
        }
      }
    }

    console.log('[DB-Init] ✓ Course tracks successfully verified & seeded.');
  } catch (err: any) {
    console.warn('[DB-Init] Auto-seed warning:', err?.message || err);
  }
}
