'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  History,
  Trophy,
  Target,
  Clock,
  ExternalLink,
  Search,
  Swords,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export interface SoloAttemptItem {
  id: string;
  quizName: string;
  categoryName: string;
  categorySlug: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeTakenSec: number;
  completedAt: string;
}

export interface DuelHistoryItem {
  id: string;
  courseName: string;
  opponentName: string;
  opponentUsername?: string | null;
  opponentAvatar?: string | null;
  myScore: number;
  opponentScore: number;
  outcome: 'VICTORY' | 'DEFEAT' | 'DRAW' | 'PENDING' | 'IN_PROGRESS';
  timeTakenSec: number;
  completedAt: string;
}

export interface RoomHistoryItem {
  id: string;
  roomCode: string;
  quizName: string;
  courseName: string;
  status: string;
  score: number;
  completionTimeSec: number;
  joinedAt: string;
}

interface Props {
  soloAttempts: SoloAttemptItem[];
  duels: DuelHistoryItem[];
  joinedRooms: RoomHistoryItem[];
}

export function DashboardHistoryTab({ soloAttempts, duels, joinedRooms }: Props) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'solo' | 'duels' | 'rooms'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatTime = (secs: number) => {
    if (!secs) return '0s';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // Filtered lists
  const filteredSolo = useMemo(() => {
    if (!searchQuery.trim()) return soloAttempts;
    const q = searchQuery.toLowerCase();
    return soloAttempts.filter(
      (s) =>
        s.categoryName.toLowerCase().includes(q) ||
        s.quizName.toLowerCase().includes(q)
    );
  }, [soloAttempts, searchQuery]);

  const filteredDuels = useMemo(() => {
    if (!searchQuery.trim()) return duels;
    const q = searchQuery.toLowerCase();
    return duels.filter(
      (d) =>
        d.courseName.toLowerCase().includes(q) ||
        d.opponentName.toLowerCase().includes(q) ||
        (d.opponentUsername && d.opponentUsername.toLowerCase().includes(q))
    );
  }, [duels, searchQuery]);

  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return joinedRooms;
    const q = searchQuery.toLowerCase();
    return joinedRooms.filter(
      (r) =>
        r.quizName.toLowerCase().includes(q) ||
        r.courseName.toLowerCase().includes(q) ||
        r.roomCode.includes(q)
    );
  }, [joinedRooms, searchQuery]);

  const totalActivities =
    soloAttempts.length + duels.length + joinedRooms.length;

  return (
    <div className="space-y-6">
      {/* Sub Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Activity ({totalActivities})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('solo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'solo'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Solo Practice ({soloAttempts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('duels')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'duels'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>1v1 Duels ({duels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('rooms')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'rooms'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tournaments ({joinedRooms.length})</span>
          </button>
        </div>

        {/* Search Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks or players..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* 1. Solo Practice History Section */}
      {(activeFilter === 'all' || activeFilter === 'solo') && (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Solo Quiz Practice Attempts
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {filteredSolo.length} recorded
            </span>
          </div>

          {filteredSolo.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs px-4">
              No solo practice attempts found for this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Track &amp; Module</th>
                    <th className="py-3 px-6 text-center">Score</th>
                    <th className="py-3 px-6 text-center">Accuracy</th>
                    <th className="py-3 px-6 text-center">Time</th>
                    <th className="py-3 px-6 text-center">Date</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSolo.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span>{att.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border ${
                            att.score >= 80
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : att.score >= 50
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {att.score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center text-xs text-slate-400 font-mono">
                        {att.correctCount}/{att.totalQuestions}
                      </td>
                      <td className="py-3.5 px-6 text-center text-xs text-slate-400 font-mono">
                        {formatTime(att.timeTakenSec)}
                      </td>
                      <td className="py-3.5 px-6 text-center text-xs text-slate-500">
                        {att.completedAt}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          href={`/quiz/result/${att.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-cyan-400 hover:text-white bg-slate-950 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                        >
                          <span>Review</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. 1v1 Duels History Section */}
      {(activeFilter === 'all' || activeFilter === 'duels') && (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1v1 Duel Challenge Arena History
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {filteredDuels.length} duels
            </span>
          </div>

          {filteredDuels.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs px-4">
              No 1v1 duel matches found for this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Opponent</th>
                    <th className="py-3 px-6">Track</th>
                    <th className="py-3 px-6 text-center">Score (You vs Opponent)</th>
                    <th className="py-3 px-6 text-center">Outcome</th>
                    <th className="py-3 px-6 text-center">Time</th>
                    <th className="py-3 px-6 text-right">Arena</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDuels.map((duel) => (
                    <tr key={duel.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 overflow-hidden">
                            {duel.opponentAvatar ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={duel.opponentAvatar}
                                alt={duel.opponentName}
                                className="w-full h-full object-cover rounded-[10px]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-slate-950 rounded-[10px]">
                                {duel.opponentName[0]?.toUpperCase() || 'O'}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-xs">{duel.opponentName}</div>
                            {duel.opponentUsername && (
                              <div className="text-[10px] text-cyan-400 font-mono">@{duel.opponentUsername}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6 font-medium text-slate-300 text-xs">
                        {duel.courseName}
                      </td>

                      <td className="py-3.5 px-6 text-center">
                        <span className="font-mono font-bold text-xs text-white">
                          <span className="text-cyan-400">{duel.myScore}%</span>
                          <span className="text-slate-500 mx-1.5">vs</span>
                          <span className="text-rose-400">{duel.opponentScore}%</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-center">
                        {duel.outcome === 'VICTORY' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Victory</span>
                          </span>
                        )}
                        {duel.outcome === 'DEFEAT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3 h-3" />
                            <span>Defeat</span>
                          </span>
                        )}
                        {duel.outcome === 'DRAW' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <span>Draw</span>
                          </span>
                        )}
                        {(duel.outcome === 'PENDING' || duel.outcome === 'IN_PROGRESS') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            <span>Playing</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-center text-xs text-slate-400 font-mono">
                        {formatTime(duel.timeTakenSec)}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <Link
                          href={`/challenge-vs/${duel.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                        >
                          <span>Arena</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. Multiplayer Tournament Rooms History Section */}
      {(activeFilter === 'all' || activeFilter === 'rooms') && (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Multiplayer Tournament Participations
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {filteredRooms.length} tournaments
            </span>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs px-4">
              No tournament participations found for this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Room Code</th>
                    <th className="py-3 px-6">Quiz Title</th>
                    <th className="py-3 px-6">Track</th>
                    <th className="py-3 px-6 text-center">Score</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6 font-mono text-xs font-bold text-cyan-400">
                        #{room.roomCode}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-white text-xs">
                        {room.quizName}
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-300">
                        {room.courseName}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-xs font-bold text-indigo-300">
                        {room.score}%
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            room.status === 'COMPLETED'
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right text-xs text-slate-500">
                        {room.joinedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
