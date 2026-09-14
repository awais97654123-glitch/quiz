'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Settings2, Hash, Gauge, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface CourseInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  questionCount: number;
}

const QUESTION_COUNTS = [10, 15, 20, 25, 30, 50];
const DIFFICULTIES = [
  { value: 'ALL', label: 'All Levels' },
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export function QuizSetupForm({ course }: { course: CourseInfo }) {
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('ALL');

  const maxQuestions = course.questionCount;

  const handleStart = () => {
    const params = new URLSearchParams({
      count: questionCount.toString(),
      difficulty,
    });
    router.push(`/quiz/countdown/${course.slug}?${params.toString()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Link */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Courses</span>
      </Link>

      {/* Course Info Card (Glass Card) */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Selected Course</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">{course.name}</h1>
        <p className="text-sm text-slate-300/80 leading-relaxed max-w-xl">{course.description}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs text-cyan-300 font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {course.questionCount} questions available in bank
        </div>
      </div>

      {/* Configuration Box (Glass Panel) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-7 border border-white/12 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-2.5 text-white">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Settings2 className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-black tracking-tight">Quiz Configuration</h2>
        </div>

        {/* Question Count */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            <Hash className="w-4 h-4 text-cyan-400" />
            Number of Questions
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {QUESTION_COUNTS.map((count) => {
              const isDisabled = count > maxQuestions;
              return (
                <button
                  key={count}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                    questionCount === count
                      ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300 scale-[1.02]'
                      : isDisabled
                      ? 'bg-white/[0.02] text-slate-600 border border-white/5 cursor-not-allowed'
                      : 'bg-white/[0.04] text-slate-300 border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-white backdrop-blur-md'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            <Gauge className="w-4 h-4 text-indigo-400" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setDifficulty(diff.value)}
                className={`py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  difficulty === diff.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400 scale-[1.02]'
                    : 'bg-white/[0.04] text-slate-300 border border-white/10 hover:border-indigo-400/40 hover:bg-white/[0.08] hover:text-white backdrop-blur-md'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl text-base font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 flex items-center justify-center gap-3 cursor-pointer animate-pulse-glow"
      >
        <Play className="w-5 h-5 fill-slate-950" />
        <span>Start Quiz Session</span>
      </button>
    </div>
  );
}
