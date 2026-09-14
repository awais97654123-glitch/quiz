'use client';

import { useState, useEffect } from 'react';
import { ClientQuestion, submitRoomQuiz } from '@/app/actions/quiz';
import { QuizSession } from '@/components/QuizSession';
import { ActivityMonitor } from '@/components/ActivityMonitor';
import { playVictory } from '@/lib/sound';
import confetti from 'canvas-confetti';
import {
  Trophy, CheckCircle2, XCircle, Clock, LayoutDashboard, Home,
  Sparkles, Zap, Award, Target, Radio
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  roomCode: string;
  quizName: string;
  courseName: string;
  timeLimit: number;
  questions: ClientQuestion[];
}

interface ResultData {
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  completionTimeSec: number;
}

export function RoomQuizWrapper({
  roomCode,
  quizName,
  courseName,
  questions,
}: Props) {
  const [result, setResult] = useState<ResultData | null>(null);

  async function handleRoomSubmit(
    answers: { questionId: string; selectedAnswer: number }[],
    timeSec: number
  ) {
    const res = await submitRoomQuiz(roomCode, answers, timeSec);
    setResult(res);
  }

  if (result) {
    return (
      <RoomQuizResult
        result={result}
        roomCode={roomCode}
        courseName={courseName}
      />
    );
  }

  return (
    <>
      <ActivityMonitor roomCode={roomCode} />
      <QuizSession
        questions={questions}
        courseName={courseName}
        courseSlug=""
        courseId=""
        quizName={quizName}
        roomMode={true}
        roomCode={roomCode}
        onRoomSubmit={handleRoomSubmit}
      />
    </>
  );
}

function RoomQuizResult({
  result,
  roomCode,
  courseName,
}: {
  result: ResultData;
  roomCode: string;
  courseName: string;
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const passed = result.score >= 60;
  const isPerfect = result.score === 100;
  const accuracy = result.totalQuestions > 0 ? Math.round((result.correctCount / result.totalQuestions) * 100) : 0;

  // Animated Count-Up Score
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(ease * result.score));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [result.score]);

  // Confetti & Audio Fanfare
  useEffect(() => {
    if (passed) {
      playVictory();
      const end = Date.now() + 1.6 * 1000;
      const colors = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b'];
      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [passed]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const avgSec = result.totalQuestions > 0 && result.completionTimeSec > 0
    ? (result.completionTimeSec / result.totalQuestions).toFixed(1)
    : '0';

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (circumference * displayScore) / 100;

  const speedRating = Number(avgSec) < 12
    ? { text: 'Lightning Pace', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    : Number(avgSec) < 25
    ? { text: 'Rapid Solver', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    : { text: 'Careful & Steady', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16 animate-fade-in relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="rounded-3xl glass-panel border border-white/15 p-6 sm:p-10 text-center backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
        <div className={`absolute inset-0 pointer-events-none opacity-20 blur-3xl ${passed ? 'bg-cyan-500' : 'bg-rose-500'}`} />

        {/* Room & Tournament Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-cyan-300 text-xs font-bold backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>ROOM #{roomCode} • {courseName}</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Assessment Submitted!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
            Your score and completion stats are live on the tournament leaderboard.
          </p>
        </div>

        {/* Animated Radial Score Circle */}
        <div className="flex items-center justify-center my-6">
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={passed ? '#06b6d4' : '#f43f5e'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 drop-shadow-[0_0_14px_rgba(6,182,212,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="font-mono text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
                {displayScore}%
              </span>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                Final Score
              </span>
            </div>
          </div>
        </div>

        {/* Performance Tier Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-xs font-bold backdrop-blur-md">
          {isPerfect ? (
            <span className="text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Perfect 100% Score! 🏆
            </span>
          ) : result.score >= 90 ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4" /> Tournament Champion Tier
            </span>
          ) : result.score >= 75 ? (
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Gold Contender Tier
            </span>
          ) : passed ? (
            <span className="text-indigo-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Silver Challenger Tier
            </span>
          ) : (
            <span className="text-rose-400 flex items-center gap-1.5">
              Keep Practicing! Don&apos;t give up
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
            </div>
            <div className="text-xl font-black text-white">{result.correctCount}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold mb-1">
              <XCircle className="w-3.5 h-3.5" /> Incorrect
            </div>
            <div className="text-xl font-black text-white">{result.incorrectCount}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-bold mb-1">
              <Clock className="w-3.5 h-3.5" /> Time
            </div>
            <div className="text-xl font-black text-white">{formatTime(result.completionTimeSec)}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs font-bold mb-1">
              <Target className="w-3.5 h-3.5" /> Accuracy
            </div>
            <div className="text-xl font-black text-white">{accuracy}%</div>
          </div>
        </div>

        {/* Speed Analytics Ribbon */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Average Speed:</span>
            <strong className="text-white">~{avgSec}s / question</strong>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] ${speedRating.color}`}>
            {speedRating.text}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <Link
            href={`/room/${roomCode}/dashboard`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>View Live Leaderboard</span>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
