'use client';

import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  User,
  School,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code2,
  Flame,
  Zap,
  Check,
  LogOut,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface OnboardingModalProps {
  user: SupabaseUser;
  onCompleted?: () => void;
}

type InstitutionType = 'SCHOOL' | 'COLLEGE' | 'UNIVERSITY';
type CodingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';

export function OnboardingModal({ user, onCompleted }: OnboardingModalProps) {
  const router = useRouter();
  const supabase = createClient();

  // Initial values from user metadata if any
  const defaultName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    '';

  const defaultUsername = (
    user?.user_metadata?.username ||
    user?.email?.split('@')[0] ||
    ''
  )
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 18);

  const [name, setName] = useState(defaultName);
  const [username, setUsername] = useState(defaultUsername);
  const [institutionType, setInstitutionType] = useState<InstitutionType>('COLLEGE');
  const [institutionName, setInstitutionName] = useState('');
  const [codingLevel, setCodingLevel] = useState<CodingLevel>('BEGINNER');

  // Username validation state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameMessage, setUsernameMessage] = useState<string>('');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Debounced username check
  useEffect(() => {
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      setUsernameAvailable(null);
      setUsernameMessage(cleanUsername ? 'Minimum 3 characters required.' : '');
      setUsernameSuggestions([]);
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(cleanUsername)}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
        setUsernameMessage(data.message || '');
        setUsernameSuggestions(data.suggestions || []);
      } catch {
        setUsernameAvailable(null);
        setUsernameMessage('Unable to check username right now.');
      } finally {
        setIsCheckingUsername(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!username.trim() || usernameAvailable === false) {
      setErrorMessage('Please choose an available unique username.');
      return;
    }

    if (!institutionName.trim()) {
      setErrorMessage(`Please enter the name of your ${institutionType.toLowerCase()}.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim().toLowerCase().replace(/^@/, ''),
          institutionType,
          institutionName: institutionName.trim(),
          codingLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to complete profile initialization.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        if (onCompleted) onCompleted();
        router.refresh();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving profile.');
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-cyan-950/40 p-5 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto">
        {/* Header Ribbon */}
        <div className="space-y-2 pb-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>DEVELOPER INITIALIZATION SESSION</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onCompleted) onCompleted();
                }}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 transition-all cursor-pointer"
              >
                Skip for now →
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-medium text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onCompleted) onCompleted();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome to CodeQuiz Arena! 🚀
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Please complete this one-time profile setup. Your information helps customize multiplayer matchmaking, ranks, and campus leaderboards.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Full Name & Unique Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Ahmed"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Unique Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="text-cyan-400 font-mono font-black">@</span>
                  <span>Unique Username</span>
                </span>
                {isCheckingUsername && (
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Checking...</span>
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono font-bold text-sm select-none">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="unique_handle"
                  maxLength={20}
                  className={`w-full pl-8 pr-9 py-2.5 rounded-xl bg-slate-950 border text-sm font-mono font-semibold text-white focus:outline-none transition-all ${
                    usernameAvailable === true
                      ? 'border-emerald-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500'
                      : usernameAvailable === false
                      ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                  }`}
                />
                {usernameAvailable === true && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                )}
                {usernameAvailable === false && (
                  <AlertCircle className="w-4 h-4 text-rose-400 absolute right-3 top-3" />
                )}
              </div>

              {/* Live Availability Note */}
              {usernameMessage && (
                <div
                  className={`text-[11px] font-medium transition-all ${
                    usernameAvailable === true
                      ? 'text-emerald-400'
                      : usernameAvailable === false
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {usernameMessage}
                </div>
              )}

              {/* Suggestions when taken */}
              {usernameSuggestions.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Try:</span>
                  {usernameSuggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setUsername(sug)}
                      className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30 transition-colors cursor-pointer"
                    >
                      @{sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: School / College / University */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Academic Institution (School, College, or University)
            </label>

            {/* 3 Institution Tabs */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setInstitutionType('SCHOOL')}
                className={`py-2 px-1.5 sm:px-3 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  institutionType === 'SCHOOL'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <School className="w-3.5 h-3.5 shrink-0" />
                <span>School</span>
              </button>

              <button
                type="button"
                onClick={() => setInstitutionType('COLLEGE')}
                className={`py-2 px-1.5 sm:px-3 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  institutionType === 'COLLEGE'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span>College</span>
              </button>

              <button
                type="button"
                onClick={() => setInstitutionType('UNIVERSITY')}
                className={`py-2 px-1.5 sm:px-3 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  institutionType === 'UNIVERSITY'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>University</span>
              </button>
            </div>

            {/* Institution Name Input */}
            <div className="space-y-1">
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder={
                  institutionType === 'SCHOOL'
                    ? 'e.g. Army Public School / Beaconhouse'
                    : institutionType === 'COLLEGE'
                    ? 'e.g. Punjab College / GC College / Cadet College'
                    : 'e.g. NUST / FAST-NUCES / Stanford University'
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Section 3: Coding Experience Level (3 Options) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Coding Experience Level (Aapka Experience Level)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Beginner */}
              <button
                type="button"
                onClick={() => setCodingLevel('BEGINNER')}
                className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  codingLevel === 'BEGINNER'
                    ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-black text-white">Beginner</div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Coding me beginner hu. Seekhna shuru kiya hai (Fundamentals & Basics).
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Level 1 • Explorer
                </div>
                {codingLevel === 'BEGINNER' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Option 2: Intermediate */}
              <button
                type="button"
                onClick={() => setCodingLevel('INTERMEDIATE')}
                className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  codingLevel === 'INTERMEDIATE'
                    ? 'bg-indigo-500/15 border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-black text-white">Intermediate</div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Thoda zyada kuch aata hai. Projects aur standard coding aati hai.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  Level 2 • Builder
                </div>
                {codingLevel === 'INTERMEDIATE' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Option 3: Expert */}
              <button
                type="button"
                onClick={() => setCodingLevel('EXPERT')}
                className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  codingLevel === 'EXPERT'
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-black text-white">Expert</div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Expert hu. Advanced algorithms, full-stack & complex architectures.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Level 3 • Master
                </div>
                {codingLevel === 'EXPERT' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Developer profile successfully initialized! Redirecting to Arena...</span>
            </div>
          )}

          {/* Submit Action Dock */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={submitting || usernameAvailable === false}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile to Server...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Activated!</span>
                </>
              ) : (
                <>
                  <span>Initialize Developer Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onCompleted) onCompleted();
              }}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition-colors text-center cursor-pointer border border-slate-700/60"
            >
              Skip for now and browse CodeQuiz Arena →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
