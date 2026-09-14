'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { respondToChallenge, getUserChallenges } from '@/app/actions/challenge';
import {
  Swords,
  Clock,
  Code2,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle2,
  Trophy,
} from 'lucide-react';

interface IncomingDuelData {
  challengeId: string;
  challengerId: string;
  challengerName: string;
  challengerUsername?: string | null;
  challengerAvatar?: string | null;
  courseName: string;
  totalQuestions: number;
  timeLimitSec: number;
}

export function ChallengeNotificationProvider() {
  const router = useRouter();
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [incomingDuel, setIncomingDuel] = useState<IncomingDuelData | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play audio chime for challenge alert
  const playAlertSound = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const notifSound = localStorage.getItem('codequiz_notif_sound') !== 'false';
        const masterSound = localStorage.getItem('codequiz_sound_enabled') !== 'false';
        if (!notifSound || !masterSound) return;
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  // Monitor Auth User
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Check DB for any active incoming challenge
  const checkPendingChallenge = useCallback(async () => {
    if (!currentUser) return;
    if (typeof window !== 'undefined' && localStorage.getItem('codequiz_notif_challenges') === 'false') {
      return; // Disabled by user settings
    }
    try {
      const res = await getUserChallenges();
      if (res.incomingPending && res.incomingPending.length > 0) {
        const top = res.incomingPending[0];
        setIncomingDuel((prev) => {
          if (prev?.challengeId === top.id) return prev;
          playAlertSound();
          return {
            challengeId: top.id,
            challengerId: top.challengerId,
            challengerName: top.challengerName,
            challengerUsername: top.challengerUsername,
            challengerAvatar: top.challengerAvatar,
            courseName: top.course?.name || 'Quiz Course',
            totalQuestions: top.totalQuestions,
            timeLimitSec: top.timeLimitSec,
          };
        });
      }
    } catch (e) {
      // Silent error
    }
  }, [currentUser, playAlertSound]);

  // Fallback periodic sync every 60s (real-time broadcast handles instant notification)
  useEffect(() => {
    if (!currentUser) return;
    checkPendingChallenge();

    const interval = setInterval(checkPendingChallenge, 60000);
    return () => clearInterval(interval);
  }, [currentUser, checkPendingChallenge]);

  // Subscribe to personal real-time notification channel
  useEffect(() => {
    if (!currentUser) return;

    const channelName = `user-notifications:${currentUser.id}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: true } },
    });

    channel
      .on('broadcast', { event: 'challenge_received' }, ({ payload }) => {
        if (!payload || !payload.challengeId) return;
        if (typeof window !== 'undefined' && localStorage.getItem('codequiz_notif_challenges') === 'false') {
          return;
        }
        playAlertSound();
        setIncomingDuel({
          challengeId: payload.challengeId,
          challengerId: payload.challengerId,
          challengerName: payload.challengerName || 'A Friend',
          challengerUsername: payload.challengerUsername || null,
          challengerAvatar: payload.challengerAvatar || null,
          courseName: payload.courseName || 'Quiz Course',
          totalQuestions: payload.totalQuestions || 10,
          timeLimitSec: payload.timeLimitSec || 300,
        });
      })
      .on('broadcast', { event: 'challenge_accepted' }, ({ payload }) => {
        if (!payload || !payload.challengeId) return;
        setFeedbackToast({
          message: `${payload.opponentName || 'Opponent'} accepted your challenge! Entering Arena...`,
          type: 'success',
        });
        setTimeout(() => {
          router.push(`/challenge-vs/${payload.challengeId}`);
        }, 1000);
      })
      .on('broadcast', { event: 'challenge_rejected' }, ({ payload }) => {
        setFeedbackToast({
          message: `${payload.opponentName || 'Opponent'} declined the duel request.`,
          type: 'info',
        });
        setTimeout(() => setFeedbackToast(null), 4000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, supabase, router, playAlertSound]);

  const handleAccept = async () => {
    if (!incomingDuel) return;
    setIsResponding(true);

    try {
      const res = await respondToChallenge({
        challengeId: incomingDuel.challengeId,
        action: 'ACCEPT',
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to accept duel.');
      }

      // Broadcast acceptance to challenger's personal channel
      const notifyChannel = supabase.channel(`user-notifications:${incomingDuel.challengerId}`);
      await notifyChannel.send({
        type: 'broadcast',
        event: 'challenge_accepted',
        payload: {
          challengeId: incomingDuel.challengeId,
          opponentName: currentUser?.user_metadata?.name || 'Friend',
        },
      });

      const duelId = incomingDuel.challengeId;
      setIncomingDuel(null);
      router.push(`/challenge-vs/${duelId}`);
    } catch (err: any) {
      alert(err.message || 'Error accepting challenge');
      setIsResponding(false);
    }
  };

  const handleDecline = async () => {
    if (!incomingDuel) return;
    setIsResponding(true);

    try {
      await respondToChallenge({
        challengeId: incomingDuel.challengeId,
        action: 'REJECT',
      });

      // Broadcast rejection to challenger's channel
      const notifyChannel = supabase.channel(`user-notifications:${incomingDuel.challengerId}`);
      await notifyChannel.send({
        type: 'broadcast',
        event: 'challenge_rejected',
        payload: {
          challengeId: incomingDuel.challengeId,
          opponentName: currentUser?.user_metadata?.name || 'Friend',
        },
      });

      setIncomingDuel(null);
    } catch (err) {
      console.error(err);
      setIncomingDuel(null);
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <>
      {/* Real-Time Incoming Duel Battle Popup - Center Screen, Big Size & Full Design */}
      {incomingDuel && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-fade-in select-none">
          <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-rose-500/70 p-6 sm:p-8 space-y-6 shadow-[0_0_80px_rgba(244,63,94,0.35)] text-center overflow-hidden transform transition-all animate-[fadeInScale_0.35s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Ambient Background Aura */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Battle Icon Badge */}
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-1 shadow-2xl shadow-rose-600/40 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-rose-400">
                <Swords className="w-10 h-10 animate-pulse text-rose-400" />
              </div>
            </div>

            {/* Duel Header */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> 1v1 Code Duel Request
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Challenge Invitation!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                A friend has challenged you to an arena battle. Randomized questions, highest score wins!
              </p>
            </div>

            {/* Challenger Card & Match Parameters */}
            <div className="p-5 rounded-2xl bg-slate-950/85 border border-slate-800/90 space-y-4 shadow-inner text-left">
              {/* Opponent Info Row */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 overflow-hidden shrink-0 shadow-lg shadow-rose-900/30">
                  {incomingDuel.challengerAvatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={incomingDuel.challengerAvatar}
                      alt="Challenger"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-xl text-white bg-slate-900 rounded-[14px]">
                      {incomingDuel.challengerName[0]?.toUpperCase() || 'D'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                    Challenger
                  </div>
                  <div className="text-lg font-extrabold text-white truncate">
                    {incomingDuel.challengerName}
                  </div>
                  {incomingDuel.challengerUsername && (
                    <div className="text-xs font-mono text-cyan-400 truncate">
                      @{incomingDuel.challengerUsername}
                    </div>
                  )}
                </div>
              </div>

              {/* Match Parameters Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400 font-medium">Battlefield</div>
                    <div className="text-xs font-bold text-white truncate">{incomingDuel.courseName}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-400 font-medium">Format</div>
                    <div className="text-xs font-bold text-white truncate">
                      {incomingDuel.totalQuestions} Qs • {Math.floor(incomingDuel.timeLimitSec / 60)} Min
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons: Accept / Decline */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleDecline}
                disabled={isResponding}
                className="w-1/3 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Decline
              </button>

              <button
                type="button"
                onClick={handleAccept}
                disabled={isResponding}
                className="flex-1 py-3.5 rounded-2xl text-xs sm:text-base font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isResponding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Entering Arena...</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-5 h-5" />
                    <span>Accept & Enter Arena</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-[999999] p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex items-center gap-3 animate-fade-in text-white text-xs sm:text-sm font-semibold max-w-sm">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0">
            <Swords className="w-5 h-5" />
          </div>
          <span>{feedbackToast.message}</span>
        </div>
      )}
    </>
  );
}
