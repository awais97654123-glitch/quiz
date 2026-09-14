'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { QuizResultReview } from '@/app/actions/quiz';
import { playVictory } from '@/lib/sound';
import {
  Trophy, CheckCircle2, XCircle, Clock, RotateCcw, Share2, Check,
  ChevronDown, ChevronUp, Sparkles, Target, BookOpen, Zap, Award,
} from 'lucide-react';

export function QuizResultView({ result }: { result: QuizResultReview }) {
  const [copied, setCopied] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [filterMode, setFilterMode] = useState<'ALL' | 'INCORRECT' | 'CORRECT'>('ALL');
  const [displayScore, setDisplayScore] = useState(0);

  const { score, totalQuestions, correctCount, incorrectCount, timeTakenSec, courseName, courseSlug, questions } = result;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassing = score >= 70;
  const isPerfect = score === 100;

  // Animated Count-Up Score
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayScore(Math.round(ease * score));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  // Performance message
  const performanceMessage = isPerfect
    ? '🏆 Perfect Score! You absolutely nailed it!'
    : score >= 90
    ? '🌟 Outstanding! Near-perfect performance!'
    : score >= 80
    ? '💪 Great job! Strong understanding demonstrated.'
    : score >= 70
    ? '👍 Good work! You passed the assessment.'
    : score >= 50
    ? '📖 Keep practicing! You\'re getting there.'
    : '💡 Don\'t give up! Review the explanations and try again.';

  // Speed analytics
  const avgSecPerQ = totalQuestions > 0 && timeTakenSec > 0 ? (timeTakenSec / totalQuestions).toFixed(1) : '0';
  const speedRating = Number(avgSecPerQ) < 12
    ? { text: 'Lightning Pace', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    : Number(avgSecPerQ) < 25
    ? { text: 'Rapid Solver', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    : { text: 'Careful & Steady', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };

  // Confetti & Victory Fanfare
  useEffect(() => {
    if (isPassing) {
      playVictory();
      const end = Date.now() + 1.5 * 1000;
      const colors = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b'];
      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [isPassing]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const text = `I scored ${score}% on the ${courseName} quiz on CodeQuiz! 🚀 ${window.location.href}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const filteredQuestions = (questions || []).filter((q) => {
    if (filterMode === 'CORRECT') return q.isCorrect;
    if (filterMode === 'INCORRECT') return !q.isCorrect;
    return true;
  });

  // SVG ring calculations based on animated displayScore
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (circumference * displayScore) / 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Score Hero Card (Frosted Glass Panel) */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-10 shadow-2xl border border-white/15 text-center">
        <div className={`absolute inset-0 pointer-events-none opacity-25 blur-3xl ${isPassing ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        {/* Performance Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md text-xs font-bold mb-6 shadow-sm">
          {isPerfect ? (
            <span className="text-amber-300 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Perfect Score!</span>
          ) : isPassing ? (
            <span className="text-emerald-400 flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Assessment Passed</span>
          ) : (
            <span className="text-rose-400">Keep Practicing!</span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">{courseName} Results</h1>
        <p className="text-sm text-slate-300/80 mb-6 max-w-md mx-auto">{performanceMessage}</p>

        {/* Animated Score Ring */}
        <div className="flex items-center justify-center my-6">
          <div className="relative w-44 h-44">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={isPassing ? '#10b981' : '#ef4444'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
                {displayScore}%
              </span>
              <span className="text-xs font-bold text-slate-300 mt-1">{correctCount} of {totalQuestions} Correct</span>
            </div>
          </div>
        </div>

        {/* Metric Cards (Frosted Glass) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mt-8 pt-8 border-t border-white/[0.08]">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
            </div>
            <div className="text-xl font-black text-white">{correctCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold mb-1">
              <XCircle className="w-3.5 h-3.5" /> Incorrect
            </div>
            <div className="text-xl font-black text-white">{incorrectCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-bold mb-1">
              <Clock className="w-3.5 h-3.5" /> Time
            </div>
            <div className="text-xl font-black text-white">{formatTime(timeTakenSec)}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs font-bold mb-1">
              <Target className="w-3.5 h-3.5" /> Accuracy
            </div>
            <div className="text-xl font-black text-white">{accuracy}%</div>
          </div>
        </div>

        {/* Speed & Analytics Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-white/[0.06] text-xs">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold backdrop-blur-md ${speedRating.color}`}>
            <Zap className="w-3.5 h-3.5" /> {speedRating.text} (~{avgSecPerQ}s / question)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-200 font-bold backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            Tier: {score >= 90 ? 'Master' : score >= 75 ? 'Expert' : score >= 60 ? 'Skilled' : 'Novice'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link href={`/quiz/setup/${courseSlug}`} className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </Link>
          <Link href="/courses" className="px-6 py-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors flex items-center gap-2 backdrop-blur-md">
            <BookOpen className="w-4 h-4" /> Other Courses
          </Link>
          <button onClick={handleShare} className="px-6 py-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors flex items-center gap-2 cursor-pointer backdrop-blur-md">
            {copied ? <><Check className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">Copied!</span></> : <><Share2 className="w-4 h-4" /> Share</>}
          </button>
        </div>
      </div>

      {/* Show/Hide Answers Toggle */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 backdrop-blur-xl transition-all cursor-pointer shadow-lg"
        >
          {showAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showAnswers ? 'Hide Answers' : 'Show All Question Reviews'}
        </button>
      </div>

      {/* Detailed Question Review (Glass Cards) */}
      {showAnswers && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-white tracking-tight">Question Breakdown</h2>
            <div className="flex items-center gap-1.5 glass-panel p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
              {(['ALL', 'INCORRECT', 'CORRECT'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterMode === mode
                      ? mode === 'INCORRECT' ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40 shadow-sm'
                        : mode === 'CORRECT' ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 shadow-sm'
                        : 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'ALL' ? `All (${questions.length})` : mode === 'INCORRECT' ? `Missed (${incorrectCount})` : `Correct (${correctCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <div key={q.id || idx} className={`rounded-3xl border p-5 sm:p-7 glass-panel backdrop-blur-2xl ${q.isCorrect ? 'border-emerald-500/35 shadow-emerald-500/5' : 'border-rose-500/35 shadow-rose-500/5'}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${q.isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                      {idx + 1}
                    </span>
                    {q.topic && <span className="text-[11px] font-bold text-cyan-300 bg-white/[0.06] px-3 py-1 rounded-xl border border-white/10">{q.topic}</span>}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${q.isCorrect ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' : 'text-rose-400 bg-rose-500/15 border-rose-500/30'}`}>
                    {q.isCorrect ? <><CheckCircle2 className="w-3.5 h-3.5" /> Correct</> : <><XCircle className="w-3.5 h-3.5" /> Incorrect</>}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-4 leading-relaxed tracking-tight">{q.question}</h3>

                <div className="space-y-2 mb-4">
                  {q.options.map((optText, optIdx) => {
                    const isUserChoice = q.selectedOption === optIdx;
                    const isCorrectAnswer = q.correctAnswer === optIdx;
                    let rowStyle = 'bg-white/[0.03] border-white/10 text-slate-300';
                    let badge = null;

                    if (isCorrectAnswer) {
                      rowStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-100 font-semibold ring-1 ring-emerald-500/40 shadow-sm';
                      badge = <span className="text-[10px] font-extrabold uppercase text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg ml-auto border border-emerald-500/30">Correct Answer</span>;
                    } else if (isUserChoice && !q.isCorrect) {
                      rowStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-100 font-semibold ring-1 ring-rose-500/40 shadow-sm';
                      badge = <span className="text-[10px] font-extrabold uppercase text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-lg ml-auto border border-rose-500/30">Your Answer</span>;
                    }

                    return (
                      <div key={optIdx} className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm backdrop-blur-md ${rowStyle}`}>
                        <span className="w-6 h-6 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center font-black text-xs shrink-0 text-slate-200">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optText}</span>
                        {badge}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Explanation:
                    </div>
                    <p className="whitespace-pre-line text-slate-300">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
