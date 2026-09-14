import { getUserQuizzes } from '@/app/actions/quiz';
import { getAuthUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import {
  Trophy,
  Users,
  PlusCircle,
  CheckCircle2,
  Calendar,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Quizzes | CodeQuiz',
  description: 'View your quiz history, created quiz rooms, and joined competitive rooms.',
};

export const dynamic = 'force-dynamic';

export default async function MyQuizzesPage() {
  const user = await getAuthUser();
  if (!user?.userId) {
    redirect('/login?redirect_url=/my-quizzes');
  }

  const { createdRooms, soloAttempts, joinedRooms } = await getUserQuizzes();

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-6">
      <BackButton fallbackUrl="/profile" label="Back to Profile" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Quizzes</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your solo assessments, hosted quiz rooms, and tournament history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/create-quiz"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-cyan-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            Create Quiz Room
          </Link>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Explore Courses
          </Link>
        </div>
      </div>

      {/* 1. Solo Quizzes History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyan-400" />
            Solo Quiz Attempts ({soloAttempts.length})
          </h2>
        </div>

        {soloAttempts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-3">
            <p>You haven&apos;t completed any solo quizzes yet.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Take a quiz now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {soloAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    {attempt.courseName}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {attempt.completedAt}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base truncate">
                  {attempt.quizName}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Score</span>
                    <span className={`font-mono text-base font-bold ${
                      attempt.score >= 70 ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>
                      {attempt.score}%
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Correct</span>
                    <span className="font-semibold text-slate-200">
                      {attempt.correctCount} / {attempt.totalQuestions}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Time</span>
                    <span className="font-mono text-slate-300">
                      {formatSec(attempt.timeTakenSec)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/quiz/result/${attempt.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-400 transition-colors"
                  >
                    <span>View Answers & Review</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Created Quiz Rooms */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Created Quiz Rooms ({createdRooms.length})
          </h2>
        </div>

        {createdRooms.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-3">
            <p>You haven&apos;t hosted any quiz rooms yet.</p>
            <Link
              href="/create-quiz"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Create your first room <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdRooms.map((room) => (
              <div
                key={room.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                    #{room.roomCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    room.status === 'IN_PROGRESS'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : room.status === 'COMPLETED'
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base truncate">
                  {room.quizName}
                </h3>
                <p className="text-xs text-slate-400">{room.courseName}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>{room.questionCount} Questions</span>
                  <span>{room.participantsCount} Joined</span>
                  <span>{room.createdAt}</span>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/room/${room.roomCode}/dashboard`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-400 transition-colors"
                  >
                    <span>Open Host Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Joined Room Quizzes */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Joined Multiplayer Rooms ({joinedRooms.length})
        </h2>

        {joinedRooms.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-3">
            <p>You haven&apos;t joined any multiplayer quiz rooms hosted by others.</p>
            <Link
              href="/join-quiz"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Join a room by code <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinedRooms.map((joined) => (
              <div
                key={joined.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-400">
                    #{joined.roomCode}
                  </span>
                  <span className="text-slate-500">{joined.joinedAt}</span>
                </div>

                <h3 className="font-bold text-white text-base truncate">
                  {joined.quizName}
                </h3>
                <p className="text-xs text-slate-400">{joined.courseName}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Score</span>
                    <span className="font-mono text-base font-bold text-cyan-400">
                      {joined.score !== null ? `${joined.score}%` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Correct</span>
                    <span className="font-semibold text-slate-300">
                      {joined.correctAnswers !== null ? joined.correctAnswers : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Time</span>
                    <span className="font-mono text-slate-400">
                      {joined.completionTimeSec ? formatSec(joined.completionTimeSec) : '—'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/room/${joined.roomCode}/dashboard`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-400 transition-colors"
                  >
                    <span>View Leaderboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
