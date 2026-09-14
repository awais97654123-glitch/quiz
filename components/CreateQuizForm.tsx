'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuizRoom } from '@/app/actions/quiz';
import { ArrowLeft, PlusCircle, Hash, Clock, Gauge, FileText, BookOpen, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface CourseInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  questionCount: number;
}

const QUESTION_COUNTS = [10, 15, 20, 25, 30, 50];
const TIME_LIMITS = [5, 10, 15, 20, 30, 45, 60];

export function CreateQuizForm({ course }: { course: CourseInfo }) {
  const router = useRouter();
  const [quizName, setQuizName] = useState(`${course.name} Quiz`);
  const [description, setDescription] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);
  const [difficulty, setDifficulty] = useState('ALL');
  const [instructions, setInstructions] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!quizName.trim()) {
      setError('Quiz name is required');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      const result = await createQuizRoom({
        courseSlug: course.slug,
        quizName: quizName.trim(),
        description: description.trim(),
        questionCount,
        timeLimit,
        difficulty,
        instructions: instructions.trim(),
      });
      router.push(`/room/${result.roomCode}/dashboard`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz room');
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/create-quiz" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Course Selection
      </Link>

      {/* Course Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 glow-card">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" /> Create Quiz Room
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1">{course.name}</h1>
        <p className="text-sm text-slate-400">{course.description}</p>
      </div>

      {/* Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
        {/* Quiz Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Quiz Name
          </label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="e.g., HTML Basics Quiz"
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Brief description of this quiz..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
          />
        </div>

        {/* Question Count */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <Hash className="w-4 h-4 text-cyan-400" /> Number of Questions
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {QUESTION_COUNTS.map((count) => {
              const isDisabled = count > course.questionCount;
              return (
                <button key={count} type="button" disabled={isDisabled} onClick={() => setQuestionCount(count)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    questionCount === count ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : isDisabled ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Limit */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <Clock className="w-4 h-4 text-amber-400" /> Time Limit (minutes)
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {TIME_LIMITS.map((t) => (
              <button key={t} type="button" onClick={() => setTimeLimit(t)}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  timeLimit === t ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600'
                }`}
              >
                {t}m
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <Gauge className="w-4 h-4 text-indigo-400" /> Difficulty
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
              <button key={d} type="button" onClick={() => setDifficulty(d)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  difficulty === d ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600'
                }`}
              >
                {d === 'ALL' ? 'All Levels' : d.charAt(0) + d.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Instructions (optional)</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={2}
            placeholder="Any special instructions for participants..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={isCreating}
        className="w-full py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 cursor-pointer"
      >
        {isCreating ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Room...
          </span>
        ) : (
          <>
            <PlusCircle className="w-5 h-5" />
            Create Quiz Room
          </>
        )}
      </button>
    </div>
  );
}
