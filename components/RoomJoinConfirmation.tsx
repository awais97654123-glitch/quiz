'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinQuizRoom } from '@/app/actions/quiz';
import { useUser } from '@/lib/supabase/useUser';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  Clock,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Play,
  LayoutDashboard,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface RoomDetails {
  id: string;
  roomCode: string;
  creatorName: string;
  creatorClerkId: string;
  courseName: string;
  courseSlug: string;
  quizName: string;
  description: string | null;
  questionCount: number;
  timeLimit: number;
  difficulty: string | null;
  instructions: string | null;
  status: string;
  participantsCount: number;
}

interface Props {
  room: RoomDetails;
}

export function RoomJoinConfirmation({ room }: Props) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHost = isLoaded && user && user.id === room.creatorClerkId;
  const isCompleted = room.status === 'COMPLETED';

  async function handleJoin() {
    if (!isLoaded) return;
    if (!user) {
      router.push(`/login?redirect_url=/room/${room.roomCode}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await joinQuizRoom(room.roomCode);

      // Instant Realtime broadcast to Host and Waiting Room
      if (res.participant) {
        try {
          const supabase = createClient();
          const channel = supabase.channel(`quiz-room:${room.roomCode}`);
          channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await channel.send({
                type: 'broadcast',
                event: 'player_joined',
                payload: res.participant,
              });
              supabase.removeChannel(channel);
            }
          });
        } catch {}
      }

      if (room.status === 'IN_PROGRESS') {
        router.push(`/room/${room.roomCode}/quiz`);
      } else {
        router.push(`/room/${room.roomCode}/waiting`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to join quiz room.');
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative space-y-3 pb-6 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
            {room.courseName}
          </span>
          <span className="font-mono text-sm font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
            #{room.roomCode}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {room.quizName}
        </h1>

        {room.description && (
          <p className="text-sm text-slate-300 leading-relaxed">
            {room.description}
          </p>
        )}

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span>Hosted by</span>
          <span className="font-medium text-slate-200">{room.creatorName}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-3 py-6">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
          <HelpCircle className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
          <div className="text-lg font-bold text-white">{room.questionCount}</div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Questions</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
          <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
          <div className="text-lg font-bold text-white">{room.timeLimit}m</div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Time Limit</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
          <Users className="w-4 h-4 text-indigo-400 mx-auto mb-1.5" />
          <div className="text-lg font-bold text-white">{room.participantsCount}</div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Joined</div>
        </div>
      </div>

      {/* Instructions / Rules */}
      {room.instructions ? (
        <div className="mb-6 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Host Instructions
          </div>
          <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed">
            {room.instructions}
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Tab switches and focus loss are monitored during this live room quiz.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {isCompleted ? (
          <div className="text-center p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <p className="text-sm font-semibold text-slate-300 mb-2">This quiz room has already ended.</p>
            <Link
              href={`/room/${room.roomCode}/dashboard`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              View Room Results <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Joining Room...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Enter Waiting Room</span>
                </>
              )}
            </button>

            {isHost && (
              <Link
                href={`/room/${room.roomCode}/dashboard`}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Open Host Dashboard</span>
              </Link>
            )}
          </>
        )}

        <div className="text-center pt-2">
          <Link
            href="/join-quiz"
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            ← Enter a different room code
          </Link>
        </div>
      </div>
    </div>
  );
}
