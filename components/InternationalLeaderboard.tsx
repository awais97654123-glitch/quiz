'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Zap,
  Clock,
  Target,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Globe,
  Swords,
  ChevronRight,
  User,
} from 'lucide-react';
import type { LeaderboardUser } from '@/app/actions/leaderboard';

interface InternationalLeaderboardProps {
  initialTop10: LeaderboardUser[];
  currentUserRank: LeaderboardUser | null;
  totalRankedPlayers: number;
}

export function InternationalLeaderboard({
  initialTop10,
  currentUserRank,
  totalRankedPlayers,
}: InternationalLeaderboardProps) {
  const [leaderboard] = useState<LeaderboardUser[]>(initialTop10);

  const firstPlace = leaderboard.find((u) => u.rank === 1);
  const secondPlace = leaderboard.find((u) => u.rank === 2);
  const thirdPlace = leaderboard.find((u) => u.rank === 3);
  const remainingTop10 = leaderboard.filter((u) => u.rank > 3);

  const formatTime = (sec: number) => {
    if (sec >= 60) {
      const mins = Math.floor(sec / 60);
      const remainingSec = sec % 60;
      return `${mins}m ${remainingSec}s`;
    }
    return `${sec}s`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6 animate-fade-in select-none">
      <BackButton fallbackUrl="/" label="Back to Home" />

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>LIVE INTERNATIONAL DEVELOPER LEADERBOARD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Global Hall of Fame •{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Top 10 Coders
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Live rankings calculated across Solo Quizzes, Multiplayer Tournaments, and 1v1 Duels. Active participation maintains top spots; inactive accounts naturally yield ranking positions.
          </p>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{totalRankedPlayers} Total Ranked Developers</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Decay Protected Active Ladder</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. TOP 3 PODIUM DISPLAY                                      */}
      {/* ============================================================ */}
      {leaderboard.length > 0 && (
        <div className="pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
            {/* 🥈 SECOND PLACE (Left Pedestal) */}
            {secondPlace && (
              <div className="order-2 md:order-1 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700/80 p-6 text-center space-y-4 shadow-xl relative overflow-hidden group hover:border-slate-500 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-slate-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  {/* Rank Badge */}
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-200 font-mono font-black text-sm shadow-md mb-3">
                    #2
                  </div>

                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-xl shadow-slate-700/30 overflow-hidden group-hover:scale-105 transition-transform">
                    {secondPlace.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={secondPlace.avatar}
                        alt={secondPlace.name}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-2xl text-white bg-slate-900 rounded-[14px]">
                        {secondPlace.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-extrabold text-white truncate">
                    {secondPlace.name}
                  </div>
                  <div className="text-xs font-mono text-cyan-400">@{secondPlace.username}</div>
                  <div className="text-[11px] text-slate-400 pt-0.5">
                    {secondPlace.codingLevel} Coder
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>MMR Rating</span>
                    <span className="font-mono text-cyan-400 font-extrabold">{secondPlace.ratingPoints}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Accuracy</span>
                    <span className="font-mono text-emerald-400">{secondPlace.averageAccuracy}%</span>
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Speed</span>
                    <span className="font-mono text-amber-400">{formatTime(secondPlace.averageTimeSec)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 🥇 FIRST PLACE (Center, Highest Pedestal) */}
            {firstPlace && (
              <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-2 border-amber-500/80 p-7 sm:p-8 text-center space-y-4 shadow-2xl shadow-amber-950/50 relative overflow-hidden group hover:border-amber-400 transition-all -translate-y-4">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                <div className="relative">
                  {/* Crown Icon */}
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-xl shadow-amber-500/40 flex items-center justify-center text-slate-950 mb-3 animate-bounce">
                    <Crown className="w-7 h-7 fill-slate-950" />
                  </div>

                  {/* Avatar with Animated Gold Ring */}
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 p-1 shadow-2xl shadow-amber-500/40 overflow-hidden group-hover:scale-105 transition-transform">
                    {firstPlace.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={firstPlace.avatar}
                        alt={firstPlace.name}
                        className="w-full h-full object-cover rounded-[22px]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-3xl text-white bg-slate-900 rounded-[22px]">
                        {firstPlace.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Rank Badge */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-mono font-black text-xs shadow-md">
                    #1 CHAMPION
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="text-lg sm:text-xl font-black text-white truncate">
                    {firstPlace.name}
                  </div>
                  <div className="text-xs font-mono text-cyan-400">@{firstPlace.username}</div>
                  <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                    {firstPlace.institutionName || 'Grandmaster Tier'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2 shadow-inner">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Championship Score</span>
                    <span className="font-mono text-amber-300 font-black text-sm">{firstPlace.ratingPoints}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Average Accuracy</span>
                    <span className="font-mono text-emerald-400 font-bold">{firstPlace.averageAccuracy}%</span>
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Duels Won</span>
                    <span className="font-mono text-rose-400 font-bold">{firstPlace.quizzesWon} Wins</span>
                  </div>
                </div>
              </div>
            )}

            {/* 🥉 THIRD PLACE (Right Pedestal) */}
            {thirdPlace && (
              <div className="order-3 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-800/60 p-6 text-center space-y-4 shadow-xl relative overflow-hidden group hover:border-amber-700 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-700/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  {/* Rank Badge */}
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 font-mono font-black text-sm shadow-md mb-3">
                    #3
                  </div>

                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-900 p-0.5 shadow-xl shadow-amber-950/40 overflow-hidden group-hover:scale-105 transition-transform">
                    {thirdPlace.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={thirdPlace.avatar}
                        alt={thirdPlace.name}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-2xl text-white bg-slate-900 rounded-[14px]">
                        {thirdPlace.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-extrabold text-white truncate">
                    {thirdPlace.name}
                  </div>
                  <div className="text-xs font-mono text-cyan-400">@{thirdPlace.username}</div>
                  <div className="text-[11px] text-slate-400 pt-0.5">
                    {thirdPlace.codingLevel} Coder
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>MMR Rating</span>
                    <span className="font-mono text-cyan-400 font-extrabold">{thirdPlace.ratingPoints}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Accuracy</span>
                    <span className="font-mono text-emerald-400">{thirdPlace.averageAccuracy}%</span>
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Speed</span>
                    <span className="font-mono text-amber-400">{formatTime(thirdPlace.averageTimeSec)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. RANKS #4 TO #10 TABLE                                      */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              International Top 10 Standings
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Positions 4 – 10</span>
        </div>

        {remainingTop10.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Play quizzes and duels to claim your spot in the top 10!
          </div>
        ) : (
          <div className="space-y-3">
            {remainingTop10.map((user) => {
              const isCurrentUser = currentUserRank?.clerkUserId === user.clerkUserId;
              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isCurrentUser
                      ? 'bg-cyan-950/40 border-cyan-500/70 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Rank & User Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Position Number */}
                    <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-black text-sm text-slate-300 shrink-0">
                      #{user.rank}
                    </div>

                    {/* Exact Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 shrink-0 overflow-hidden shadow-md">
                      {user.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-[10px]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-base text-white bg-slate-950 rounded-[10px]">
                          {user.name[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="truncate">{user.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-cyan-400 truncate">@{user.username}</div>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-[11px] text-slate-400 font-medium">Coding Level</span>
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      {user.codingLevel}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-center sm:text-right">
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Accuracy</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {user.averageAccuracy}%
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Avg Speed</div>
                      <div className="text-xs font-bold text-slate-200 font-mono">
                        {formatTime(user.averageTimeSec)}
                      </div>
                    </div>

                    <div className="text-right pl-1 sm:pl-2">
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Rating Score</div>
                      <div className="text-xs sm:text-sm font-black text-cyan-400 font-mono">
                        {user.ratingPoints}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. YOUR CURRENT STANDING BANNER (IF OUTSIDE TOP 10)          */}
      {/* ============================================================ */}
      {currentUserRank && currentUserRank.rank > 10 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-mono font-black text-lg shrink-0">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                Your Current Global Standing
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                Rank #{currentUserRank.rank} of {totalRankedPlayers} Developers
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Rating: <strong className="text-cyan-400 font-mono">{currentUserRank.ratingPoints}</strong> • Win more matches to climb into the International Top 10!
              </div>
            </div>
          </div>

          <Link
            href="/courses"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:from-cyan-300 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Play Quizzes to Climb</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
