'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Target, Zap, Crown, Award, ArrowUpRight } from 'lucide-react';
import type { UserAnalyticsData } from '@/app/actions/leaderboard';

interface Props {
  analytics: UserAnalyticsData | null;
}

export function ProfileAnalyticsRings({ analytics }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger radial bar animation after mount
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const totalScore = analytics?.totalScore ?? 0;
  const ratingPoints = analytics?.ratingPoints ?? 1000;
  const accuracy = analytics?.averageAccuracy ?? 0;
  const averageTimeSec = analytics?.averageTimeSec ?? 45;
  const globalRank = analytics?.globalRank ?? 1;
  const totalPlayers = analytics?.totalRankedPlayers ?? 1;
  const percentile = analytics?.percentile ?? 50;

  // Speed score calculation (normalized: 15s or less = 100%, 90s or more = 20%)
  const speedPercentage = Math.max(
    15,
    Math.min(100, Math.round(100 - ((averageTimeSec - 10) / 80) * 85))
  );

  // Rating percentage toward 2500 Master rank
  const ratingPercentage = Math.min(100, Math.max(10, Math.round((ratingPoints / 2500) * 100)));

  // Tier designation
  const getTier = (rp: number) => {
    if (rp >= 2200) return { name: 'Grandmaster', color: 'text-amber-400', border: 'border-amber-500/30' };
    if (rp >= 1800) return { name: 'Diamond Master', color: 'text-cyan-400', border: 'border-cyan-500/30' };
    if (rp >= 1400) return { name: 'Platinum Coder', color: 'text-indigo-400', border: 'border-indigo-500/30' };
    return { name: 'Challenger', color: 'text-emerald-400', border: 'border-emerald-500/30' };
  };

  const tier = getTier(ratingPoints);

  const rings = [
    {
      id: 'score',
      title: 'Rating & Score',
      value: `${ratingPoints.toLocaleString()} RP`,
      subtext: `${totalScore.toLocaleString()} pts accumulated`,
      percentage: ratingPercentage,
      gradientId: 'grad-score',
      colorFrom: '#06b6d4', // cyan-500
      colorTo: '#6366f1',   // indigo-500
      textColor: 'text-cyan-400',
      icon: Trophy,
      badge: tier.name,
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    },
    {
      id: 'accuracy',
      title: 'Average Accuracy',
      value: `${accuracy}%`,
      subtext: accuracy >= 80 ? 'Mastery tier accuracy' : 'Active precision',
      percentage: Math.max(5, accuracy),
      gradientId: 'grad-accuracy',
      colorFrom: '#10b981', // emerald-500
      colorTo: '#14b8a6',   // teal-500
      textColor: 'text-emerald-400',
      icon: Target,
      badge: accuracy >= 85 ? 'Sharpshooter' : 'Calibrated',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    {
      id: 'speed',
      title: 'Average Response Speed',
      value: `${averageTimeSec}s`,
      subtext: `${averageTimeSec <= 20 ? 'Lightning fast' : averageTimeSec <= 40 ? 'Swift thinking' : 'Deliberate'} pace`,
      percentage: speedPercentage,
      gradientId: 'grad-speed',
      colorFrom: '#f59e0b', // amber-500
      colorTo: '#ef4444',   // red-500
      textColor: 'text-amber-400',
      icon: Zap,
      badge: averageTimeSec <= 25 ? 'High Velocity' : 'Steady Pace',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    },
    {
      id: 'rank',
      title: 'Global Position',
      value: `#${globalRank}`,
      subtext: `Top ${Math.max(1, 100 - percentile)}% of ${totalPlayers} coders`,
      percentage: Math.max(10, percentile),
      gradientId: 'grad-rank',
      colorFrom: '#a855f7', // purple-500
      colorTo: '#ec4899',   // pink-500
      textColor: 'text-purple-400',
      icon: Crown,
      badge: globalRank <= 10 ? 'Top 10 Global' : `Rank #${globalRank}`,
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    },
  ];

  // SVG Circular Constants
  const size = 150;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <span>Realtime Performance Analytics</span>
        </h2>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          Live Backend Calculation
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rings.map((ring) => {
          const Icon = ring.icon;
          const strokeDashoffset = animated
            ? circumference - (ring.percentage / 100) * circumference
            : circumference;

          return (
            <div
              key={ring.id}
              className="relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl hover:border-slate-700 transition-all flex flex-col items-center text-center group overflow-hidden"
            >
              {/* Subtle top ambient glow */}
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: ring.colorFrom }}
              />

              {/* Title & Badge */}
              <div className="flex items-center justify-between w-full mb-3">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${ring.textColor}`} />
                  {ring.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ring.badgeColor}`}
                >
                  {ring.badge}
                </span>
              </div>

              {/* Circular SVG Progress Ring */}
              <div className="relative w-[150px] h-[150px] flex items-center justify-center my-2">
                <svg
                  width={size}
                  height={size}
                  className="transform -rotate-90 origin-center drop-shadow-md"
                >
                  <defs>
                    <linearGradient
                      id={ring.gradientId}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={ring.colorFrom} />
                      <stop offset="100%" stopColor={ring.colorTo} />
                    </linearGradient>
                  </defs>

                  {/* Track Circle */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#1e293b" // slate-800
                    strokeWidth={strokeWidth}
                    className="opacity-70"
                  />

                  {/* Animated Progress Circle */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={`url(#${ring.gradientId})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </svg>

                {/* Center Content Inside Circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white tracking-tight">
                    {ring.value}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    {ring.percentage}% efficiency
                  </span>
                </div>
              </div>

              {/* Bottom Details */}
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {ring.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
