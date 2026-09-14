'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ClientQuestion, submitSoloQuiz } from '@/app/actions/quiz';
import { playSelect, playVictory, isSoundEnabled, setSoundEnabled, playQuizBgm, stopQuizBgm } from '@/lib/sound';
import { Timer, Code, AlertTriangle, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface QuizSessionProps {
  questions: ClientQuestion[];
  courseName: string;
  courseSlug: string;
  courseId?: string;
  quizName?: string;
  /** For room quizzes — uses different submit */
  roomMode?: boolean;
  roomCode?: string;
  onRoomSubmit?: (answers: { questionId: string; selectedAnswer: number }[], timeSec: number) => Promise<void>;
}

export function QuizSession({
  questions,
  courseName,
  courseSlug,
  quizName,
  roomMode = false,
  roomCode,
  onRoomSubmit,
}: QuizSessionProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  // Answer feedback state
  const [feedbackState, setFeedbackState] = useState<'idle' | 'showing'>('idle');
  const [selectedForFeedback, setSelectedForFeedback] = useState<number | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent =
    totalQuestions > 0
      ? Math.round(((currentIndex + (feedbackState === 'showing' ? 1 : 0)) / totalQuestions) * 100)
      : 0;

  // Initialize sound preference & start Quiz Background Music
  useEffect(() => {
    setSoundOn(isSoundEnabled());
    playQuizBgm();
    return () => {
      stopQuizBgm();
    };
  }, []);

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup feedback timer
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = useCallback(async (lastOptionIndex?: number) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      stopQuizBgm();
      playVictory();

      const finalAnswers = { ...answers };
      if (lastOptionIndex !== undefined && currentQ) {
        finalAnswers[currentQ.id] = lastOptionIndex;
      }

      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: finalAnswers[q.id] !== undefined ? finalAnswers[q.id] : -1,
      }));

      if (roomMode && onRoomSubmit) {
        await onRoomSubmit(payloadAnswers, secondsElapsed);
      } else {
        const res = await submitSoloQuiz({
          courseSlug,
          quizName: quizName || `${courseName} Quiz`,
          answers: payloadAnswers,
          timeTakenSec: secondsElapsed,
        });
        router.push(`/quiz/result/${res.attemptId}`);
      }
    } catch (err: unknown) {
      console.error('Quiz submission error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  }, [answers, currentQ, questions, roomMode, onRoomSubmit, secondsElapsed, courseSlug, quizName, courseName, router]);

  const handleSelectOption = useCallback((optionIndex: number) => {
    if (feedbackState === 'showing') return; // prevent double-click during feedback

    // Play synthesized option select click sound
    playSelect();

    // Read user preferences
    const autoAdvanceEnabled = typeof window !== 'undefined' ? localStorage.getItem('codequiz_auto_advance') !== 'false' : true;
    const instantFeedbackEnabled = typeof window !== 'undefined' ? localStorage.getItem('codequiz_instant_feedback') !== 'false' : true;

    // Record answer
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }));
    if (instantFeedbackEnabled) {
      setSelectedForFeedback(optionIndex);
      setFeedbackState('showing');
    }

    // Auto-advance delay
    const advanceDelay = autoAdvanceEnabled ? 700 : 1800;

    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackState('idle');
      setSelectedForFeedback(null);

      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Auto-submit on last question
        handleAutoSubmit(optionIndex);
      }
    }, advanceDelay);
  }, [currentIndex, totalQuestions, currentQ, feedbackState, handleAutoSubmit]);

  const difficultyColors: Record<string, string> = {
    EASY: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    HARD: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  if (totalQuestions === 0 || !currentQ) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white">No Questions Available</h2>
          <p className="text-xs text-slate-400">There are no questions found for this quiz session.</p>
          <button
            onClick={() => router.push('/courses')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-xl font-bold text-white">Submitting your answers...</h2>
          <p className="text-sm text-slate-400">Please wait while we grade your quiz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-start max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
      {/* Ambient background glows for question glass refraction */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Glass Header HUD Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 mb-5 pb-3 sm:pb-4 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to exit this quiz session? Any unsaved progress will be lost.')) {
                stopQuizBgm();
                router.push(roomMode ? '/join-quiz' : '/courses');
              }
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 transition-all text-xs font-semibold shadow-sm cursor-pointer group shrink-0"
            title="Exit quiz session"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-wider truncate max-w-[160px] sm:max-w-none">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="truncate">{courseName} {roomMode && roomCode && `• Room #${roomCode}`}</span>
            </div>
            <h1 className="text-base sm:text-2xl font-black text-white tracking-tight truncate">
              Question {currentIndex + 1}{' '}
              <span className="text-slate-400 text-xs sm:text-sm font-normal">of {totalQuestions}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Audio Mute/Unmute Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              setSoundEnabled(next);
            }}
            title={soundOn ? 'Sound is ON (click to mute)' : 'Sound is OFF (click to unmute)'}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-semibold shadow-sm"
          >
            {soundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">Audio</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Muted</span>
              </>
            )}
          </button>

          {/* Glass Timer Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-inner">
            <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-100">
              {formatTime(secondsElapsed)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-8 relative z-10">
        <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
          <span>
            Progress: <strong className="text-slate-200">{answeredCount}</strong> of {totalQuestions} answered
          </span>
          <span className="font-mono font-bold text-cyan-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-900/80 border border-white/[0.08] p-0.5 overflow-hidden backdrop-blur-md">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card (Glassmorphism with Animated Entrance per Question) */}
      <div
        key={currentQ.id}
        className="glass-panel rounded-3xl p-4 sm:p-9 relative shadow-2xl overflow-hidden mb-8 border border-white/15 animate-card-entrance"
      >
        {/* Top ambient glass specular sheen & interior light */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
          {currentQ.topic && (
            <span className="px-3 py-1 text-xs font-bold bg-white/[0.08] backdrop-blur-xl text-cyan-300 border border-white/15 rounded-xl shadow-sm">
              {currentQ.topic}
            </span>
          )}
          <span
            className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider border rounded-xl backdrop-blur-xl ${
              difficultyColors[currentQ.difficulty] || 'bg-white/[0.06] text-slate-200 border-white/15'
            }`}
          >
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-2xl font-black text-white leading-relaxed mb-6 relative z-10 tracking-tight">
          {currentQ.question}
        </h2>

        {/* Code Snippet (Glass container) */}
        {currentQ.codeSnippet && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/15 bg-black/60 backdrop-blur-2xl shadow-xl relative z-10">
            <div className="flex items-center px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.03] text-xs text-slate-300 font-mono">
              <Code className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              Code Snippet
            </div>
            <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-cyan-200 leading-relaxed">
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* 4 Options Grid (Frosted Glass Interactive Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1 relative z-10">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            const optionLetter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={feedbackState === 'showing'}
                className={`group p-3.5 sm:p-4.5 min-h-[52px] rounded-2xl border text-left font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-start gap-3 sm:gap-3.5 backdrop-blur-2xl ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/30 via-sky-500/25 to-indigo-500/25 border-cyan-400 text-white ring-2 ring-cyan-500/50 shadow-[0_0_28px_rgba(6,182,212,0.35)] scale-[1.015]'
                    : 'glass-option text-slate-200 hover:text-white hover:border-cyan-400/50 hover:bg-white/[0.08]'
                } ${feedbackState === 'showing' ? 'cursor-default' : ''}`}
              >
                <span
                  className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-md transition-colors ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-cyan-500/50'
                      : 'bg-white/[0.08] group-hover:bg-cyan-400/20 text-slate-200 group-hover:text-cyan-300 border border-white/15'
                  }`}
                >
                  {optionLetter}
                </span>
                <span className="flex-1 leading-snug font-medium pt-0.5">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
