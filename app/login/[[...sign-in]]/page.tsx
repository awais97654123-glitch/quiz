import { SupabaseLoginForm } from '@/components/SupabaseLoginForm';
import { BackButton } from '@/components/BackButton';
import { Zap, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | CodeQuiz',
  description: 'Sign in to CodeQuiz with Google or your email to access quizzes, live multiplayer rooms, and leaderboards.',
};

interface Props {
  searchParams: Promise<{ redirect_url?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect_url } = await searchParams;

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-8 md:py-14 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-6 flex justify-start relative z-10">
        <BackButton fallbackUrl="/" label="Back to Home" />
      </div>

      {/* Brand Hero Header */}
      <div className="text-center mb-7 space-y-3 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Real-time Interactive Coding Quizzes</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">CodeQuiz</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Sign in to compete in multiplayer quiz rooms, track programming evaluations, and rank on the global developer leaderboard.
        </p>
      </div>

      {/* Supabase Authentication Card */}
      <div className="w-full max-w-md relative z-10">
        <SupabaseLoginForm redirectUrl={redirect_url} />
      </div>

      {/* Trust & Features Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live Multiplayer Rooms</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Global Leaderboard</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase Cloud Security</span>
        </div>
      </div>
    </div>
  );
}
