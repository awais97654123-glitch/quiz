'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  History,
  Radio,
  BookOpen,
  Swords,
  Users,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Flame,
  Clock,
  Layers,
} from 'lucide-react';
import {
  DashboardHistoryTab,
  type SoloAttemptItem,
  type DuelHistoryItem,
  type RoomHistoryItem,
} from './DashboardHistoryTab';

export interface CreatedRoomItem {
  id: string;
  roomCode: string;
  quizName: string;
  courseName: string;
  status: string;
  questionCount: number;
  participantsCount: number;
  createdAt: string;
}

interface Props {
  soloAttempts: SoloAttemptItem[];
  duels: DuelHistoryItem[];
  joinedRooms: RoomHistoryItem[];
  createdRooms: CreatedRoomItem[];
  pendingDuelsCount: number;
}

export function DashboardSessionTabs({
  soloAttempts,
  duels,
  joinedRooms,
  createdRooms,
  pendingDuelsCount,
}: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'hosted'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const quickTracks = [
    { name: 'HTML5 Modern', slug: 'html', color: 'from-amber-500 to-orange-600', icon: '🌐' },
    { name: 'CSS3 & Tailwind', slug: 'css', color: 'from-blue-500 to-cyan-600', icon: '🎨' },
    { name: 'Modern JavaScript', slug: 'javascript', color: 'from-yellow-400 to-amber-500', icon: '⚡' },
    { name: 'React 19 & Next.js', slug: 'react', color: 'from-cyan-400 to-sky-600', icon: '⚛️' },
    { name: 'Python 3 Mastery', slug: 'python', color: 'from-emerald-400 to-teal-600', icon: '🐍' },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview &amp; Launch</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History Tab</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300">
              {soloAttempts.length + duels.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hosted')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hosted'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>My Hosted Rooms</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300">
              {createdRooms.length}
            </span>
          </button>
        </div>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link
            href="/create-quiz"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Host New Room</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW & ARENA LAUNCH
         ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Launch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/#courses"
              className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 hover:border-cyan-500/50 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Solo Practice Arena
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sharpen your skills across HTML, CSS, JavaScript, React, and Python with immediate answers.
                </p>
              </div>
            </Link>

            <Link
              href="/#challenge"
              className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/20 hover:border-rose-500/50 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Swords className="w-5 h-5" />
                </div>
                {pendingDuelsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                    {pendingDuelsCount} Pending
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  1v1 Friend Duel Arena
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Challenge any developer by @username with randomized questions and high-speed tiebreakers.
                </p>
              </div>
            </Link>

            <Link
              href="/create-quiz"
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 hover:border-indigo-500/50 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Multiplayer Tournaments
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Host an 8-digit room for 2 to 1,000+ simultaneous coders with live podium leaderboards.
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Track Selection */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recommended Skill Tracks
                </h3>
              </div>
              <Link href="/#courses" className="text-xs text-cyan-400 hover:underline">
                View All Categories →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {quickTracks.map((track) => (
                <Link
                  key={track.slug}
                  href={`/quiz/${track.slug}`}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all group flex flex-col items-center text-center space-y-2"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">{track.icon}</span>
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {track.name}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    10 Qs • Medium
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: COMPREHENSIVE HISTORY TAB
         ======================================================== */}
      {activeTab === 'history' && (
        <DashboardHistoryTab
          soloAttempts={soloAttempts}
          duels={duels}
          joinedRooms={joinedRooms}
        />
      )}

      {/* ========================================================
          TAB 3: MY HOSTED ROOMS & CREATED TOURNAMENTS
         ======================================================== */}
      {activeTab === 'hosted' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Manage your hosted tournament rooms, share room codes, and access the live host control room.
            </p>
            <Link
              href="/create-quiz"
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Room</span>
            </Link>
          </div>

          {createdRooms.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <Radio className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Hosted Rooms Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven&apos;t created any multiplayer tournament rooms yet. Host a room to challenge friends and students in real-time!
              </p>
              <div className="pt-2">
                <Link
                  href="/create-quiz"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md shadow-cyan-500/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Host Your First Quiz</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {createdRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {room.courseName}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">
                        {room.quizName}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Created on {room.createdAt}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        room.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : room.status === 'IN_PROGRESS'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  {/* Room Code Badge & Copy */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">
                        8-Digit Room Code
                      </div>
                      <div className="text-lg font-black font-mono text-cyan-400 tracking-wider">
                        {room.roomCode}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(room.roomCode)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode === room.roomCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Footer Stats & Open Control Room */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{room.participantsCount} Players Joined</span>
                    </div>

                    <Link
                      href={`/room/${room.roomCode}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm"
                    >
                      <span>Control Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
