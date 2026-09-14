'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/supabase/useUser';
import { createClient } from '@/lib/supabase/client';
import { playCountdownTick, playCountdownGo } from '@/lib/sound';
import { BackButton } from '@/components/BackButton';
import {
  Users,
  Clock,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  Search,
  Radio,
  Share2,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

interface Participant {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  status: string;
}

interface RoomState {
  roomCode: string;
  quizName: string;
  courseName: string;
  status: string;
  questionCount: number;
  timeLimit: number;
  creatorClerkId: string;
  participants: Participant[];
}

interface Props {
  initialState: RoomState;
}

export function WaitingRoom({ initialState }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const supabase = useMemo(() => createClient(), []);

  const [state, setState] = useState<RoomState>(initialState);
  const [copied, setCopied] = useState(false);
  const [startingNotice, setStartingNotice] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPlayerToast, setNewPlayerToast] = useState<string | null>(null);
  const hasRedirectedRef = useRef(false);
  const isCountingDownRef = useRef(false);

  const isHost = user && user.id === state.creatorClerkId;

  // Supabase Realtime Channel (0ms live updates)
  useEffect(() => {
    const channel = supabase.channel(`quiz-room:${state.roomCode}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on('broadcast', { event: 'player_joined' }, ({ payload }) => {
        if (!payload || !payload.userId) return;

        setNewPlayerToast(payload.userName || 'New Player');
        setTimeout(() => setNewPlayerToast(null), 3500);

        setState((prev) => {
          const exists = prev.participants.some(
            (p) => p.userId === payload.userId || p.id === payload.id
          );
          if (exists) return prev;

          const newP: Participant = {
            id: payload.id || `p_${Date.now()}`,
            userId: payload.userId,
            userName: payload.userName || 'Player',
            userAvatar: payload.userAvatar || null,
            status: payload.status || 'WAITING',
          };

          return {
            ...prev,
            participants: [newP, ...prev.participants],
          };
        });
      })
      .on('broadcast', { event: 'quiz_countdown' }, () => {
        if (hasRedirectedRef.current || isCountingDownRef.current) return;
        isCountingDownRef.current = true;

        setCountdown(3);
        playCountdownTick(3);

        setTimeout(() => {
          setCountdown(2);
          playCountdownTick(2);
        }, 1000);

        setTimeout(() => {
          setCountdown(1);
          playCountdownTick(1);
        }, 2000);

        setTimeout(() => {
          setCountdown(0);
          playCountdownGo();

          setTimeout(() => {
            hasRedirectedRef.current = true;
            router.push(`/room/${state.roomCode}/quiz`);
          }, 800);
        }, 3000);
      })
      .on('broadcast', { event: 'quiz_started' }, () => {
        if (!hasRedirectedRef.current && !isCountingDownRef.current) {
          hasRedirectedRef.current = true;
          setStartingNotice(true);
          setTimeout(() => {
            router.push(`/room/${state.roomCode}/quiz`);
          }, 1000);
        }
      })
      .subscribe();

    // 1.5s fast polling fallback
    let isMounted = true;
    async function pollStatus() {
      try {
        const res = await fetch(`/api/room/${state.roomCode}/status`);
        if (!res.ok) return;
        const data: RoomState = await res.json();
        if (!isMounted) return;

        setState(data);

        // Check if quiz has started
        if (data.status === 'IN_PROGRESS' && !hasRedirectedRef.current && !isCountingDownRef.current) {
          hasRedirectedRef.current = true;
          setStartingNotice(true);
          setTimeout(() => {
            router.push(`/room/${state.roomCode}/quiz`);
          }, 1000);
        }
      } catch {}
    }

    const interval = setInterval(pollStatus, 1500);

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [state.roomCode, router, supabase]);

  function copyRoomCode() {
    navigator.clipboard.writeText(state.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyJoinLink() {
    const url = `${window.location.origin}/room/${state.roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Filter participants for high concurrency (1000+ players)
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return state.participants;
    const q = searchQuery.toLowerCase().trim();
    return state.participants.filter(
      (p) =>
        (p?.userName || '').toLowerCase().includes(q) ||
        (p?.userId || '').toLowerCase().includes(q)
    );
  }, [state.participants, searchQuery]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
      {/* 3... 2... 1... GO! Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 animate-fade-in select-none">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
            <div className="relative z-10 w-44 h-44 rounded-full border-4 border-cyan-500/40 bg-slate-900/80 flex items-center justify-center shadow-2xl shadow-cyan-500/40">
              <span className="font-mono text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 animate-scale-up">
                {countdown === 0 ? 'GO!' : countdown}
              </span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-8 tracking-tight">
            {countdown === 0 ? 'Quiz Launched!' : 'Quiz Starting In...'}
          </h2>
          <p className="text-sm text-cyan-300/80 font-medium mt-2">
            Get ready to answer fast and climb the leaderboard!
          </p>
        </div>
      )}

      {/* Starting Fullscreen Overlay */}
      {startingNotice && countdown === null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-6 animate-bounce shadow-2xl shadow-cyan-500/30">
            <Zap className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
            Quiz is Launching!
          </h2>
          <p className="text-sm sm:text-base text-cyan-300 font-semibold">
            Prepare yourself! Loading quiz questions...
          </p>
        </div>
      )}

      {/* Toast when player joins live */}
      {newPlayerToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-up flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 backdrop-blur-xl shadow-2xl">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold">
            <strong className="text-white font-extrabold">{newPlayerToast}</strong> entered the room!
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: 8-DIGIT PROMINENT ROOM CODE                               */}
      {/* ========================================================================= */}
      <div className="flex justify-start">
        <BackButton fallbackUrl="/join-quiz" label="Leave Waiting Room" />
      </div>

      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-cyan-500/30 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] sm:text-xs font-bold">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>LIVE TOURNAMENT ROOM CODE</span>
        </div>

        <div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">{state.quizName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Category: {state.courseName}</p>
        </div>

        {/* Big 8-digit Code */}
        <div className="inline-block p-2.5 sm:p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 max-w-full">
          <span className="font-mono text-3xl sm:text-6xl md:text-7xl font-black tracking-wider sm:tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 select-all block">
            {state.roomCode}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1">
          <button
            onClick={copyRoomCode}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Code Copied!' : 'Copy Room Code'}</span>
          </button>

          <button
            onClick={copyJoinLink}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Invite Link</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. WAITING FOR HOST STATUS                                                */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <Users className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">Waiting for Host to Launch Quiz</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Stay tuned! As soon as the host clicks &quot;Start Quiz&quot;, your assessment will load automatically on this screen.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <strong>{state.questionCount}</strong> Questions
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <strong>{state.timeLimit}</strong> Minutes
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-950/40 text-emerald-300 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <strong>{state.participants.length}</strong> Players Live
            </span>
          </div>
        </div>

        {/* Host banner if current user is host */}
        {isHost && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-cyan-300">You are the Quiz Host</div>
              <div className="text-[11px] text-slate-400">You can start the tournament from the Host Dashboard</div>
            </div>
            <Link
              href={`/room/${state.roomCode}/dashboard`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md shadow-cyan-500/20 shrink-0"
            >
              <LayoutDashboard className="w-4 h-4" />
              Open Host Dashboard
            </Link>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. LIVE PARTICIPANTS WALL (REALTIME UPDATES WITH SEARCH)                   */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">Joined Players</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {state.participants.length}
              </span>
            </div>

            {/* Search bar for 1000+ players */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search joined player..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
            {filteredParticipants.map((p) => {
              const isCurrentUser = user && user.id === p.userId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    isCurrentUser
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden shadow-inner">
                    {p.userAvatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.userAvatar} alt={p.userName} className="w-full h-full object-cover" />
                    ) : (
                      p.userName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate flex items-center gap-1">
                      <span>{p.userName}</span>
                      {isCurrentUser && (
                        <span className="text-[10px] text-cyan-400 font-semibold">(You)</span>
                      )}
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Ready in lobby
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proctoring Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Anti-Cheat Active:</strong> Tab changes, window minimizes, and blur events are monitored during the live quiz.
          </span>
        </div>
      </div>
    </div>
  );
}
