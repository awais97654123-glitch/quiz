import { redirect } from 'next/navigation';
import { getAuthUser } from '@/app/actions/auth';
import { getUserDashboardStats } from '@/app/actions/quiz';
import { getUserAnalytics } from '@/app/actions/leaderboard';
import { ProfileSignOutButton } from '@/components/ProfileSignOutButton';
import { ProfileAnalyticsRings } from '@/components/ProfileAnalyticsRings';
import { BackButton } from '@/components/BackButton';
import Link from 'next/link';
import {
  Mail,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  Sparkles,
  Shield,
  Camera,
  GraduationCap,
  Code2,
  Flame,
  UserCheck,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | CodeQuiz Arena',
  description: 'View your verified developer credentials, academic details, and live skill analytics.',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getAuthUser();
  const isGuest = !user;

  const [stats, analytics] = await Promise.all([
    getUserDashboardStats(),
    user ? getUserAnalytics(user.userId) : null,
  ]);

  const formatSecs = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const displayName = user?.name || 'Guest Developer';
  const displayUsername = user?.username ? `@${user.username}` : '@guest';
  const primaryEmail = user?.email || 'guest@codequiz.dev';
  const ratingPoints = analytics?.ratingPoints || 1000;

  const getTierDetails = (rp: number) => {
    if (rp >= 2200) return { name: 'Grandmaster Coder', color: 'from-amber-400 to-orange-500', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    if (rp >= 1800) return { name: 'Diamond Master', color: 'from-cyan-400 to-blue-500', badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    if (rp >= 1400) return { name: 'Platinum Contender', color: 'from-indigo-400 to-violet-500', badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
    return { name: 'Challenger Rank', color: 'from-emerald-400 to-teal-500', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  };

  const tier = getTierDetails(ratingPoints);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallbackUrl="/" label="Back to Home" />
        <Link
          href="/settings"
          className="text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
        >
          <span>Settings &amp; Preferences →</span>
        </Link>
      </div>

      {/* Guest Mode Notice */}
      {isGuest && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-xs sm:text-sm text-indigo-200">
              You are viewing a <strong>Guest Developer Profile</strong>. Sign in to permanently save your assessments, sync MMR, and unlock 1v1 friend duels.
            </div>
          </div>
          <Link
            href="/login?redirect_url=/profile"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer text-center shadow-md shadow-indigo-600/30"
          >
            Sign In / Register
          </Link>
        </div>
      )}

      {/* 1. Developer Profile Identity Card */}
      <div className="rounded-3xl bg-slate-900/85 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          {/* Avatar with Customizer Link */}
          <div className="flex flex-col items-center sm:items-start gap-2.5 shrink-0">
            <Link
              href="/profile/edit-avatar"
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 p-1 shadow-2xl shrink-0 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all hover:scale-[1.03]"
              title="Click to customize avatar and photo"
            >
              {user?.avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-[22px]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-3xl text-white bg-slate-950 rounded-[22px]">
                  {(displayName || 'D')[0].toUpperCase()}
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[22px] text-white">
                <Camera className="w-6 h-6 text-cyan-300 animate-pulse" />
                <span className="text-[11px] font-bold text-cyan-200 mt-1">Change Photo</span>
              </div>

              {/* Camera Badge Icon */}
              <div
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-cyan-400 text-slate-950 border-2 border-slate-900 shadow-md"
                title="Edit Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/profile/edit-avatar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Customize Avatar</span>
            </Link>
          </div>

          {/* User Details */}
          <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {displayName}
                </h1>
                {user?.username && (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm">
                    @{user.username}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${tier.badge}`}>
                  <Sparkles className="w-3 h-3" />
                  <span>{tier.name}</span>
                </span>
              </div>
            </div>

            {/* Email & Academic Credentials */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                {primaryEmail}
              </span>

              {user?.institutionName && (
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>
                    {user.institutionType ? `${user.institutionType.charAt(0) + user.institutionType.slice(1).toLowerCase()}: ` : ''}
                    {user.institutionName}
                  </span>
                </span>
              )}

              {user?.codingLevel && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-amber-500/30">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  {user.codingLevel} DEVELOPER
                </span>
              )}

              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                <UserCheck className="w-4 h-4" />
                <span>{isGuest ? 'Guest Session' : 'Verified Account'}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                href="/profile/edit-avatar"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-cyan-500/20"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Avatar Studio</span>
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors shadow-sm"
              >
                <span>Preferences &amp; Settings</span>
              </Link>

              {!isGuest && <ProfileSignOutButton />}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Realtime Radial Analytics (MMR, Accuracy, Speed, Rank) */}
      <ProfileAnalyticsRings analytics={analytics} />

      {/* 3. Lifetime Performance Analytics Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Lifetime Assessment &amp; Skill Metrics</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalCompleted}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Quizzes Solved
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-300">{stats.averageScore}%</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Average Accuracy
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.bestScore}%</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Personal Best
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{formatSecs(stats.totalTimeSec)}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Dedication Time
            </div>
          </div>
        </div>
      </div>

      {/* 4. Credentials & Security Details */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Profile Authentication &amp; Security</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your profile is securely synced to your User ID (<code className="text-slate-300 font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded">{user?.userId || 'Guest Session'}</code>). All assessment ratings, MMR points, accuracy percentiles, and avatar customizer assets are encrypted and tied to this account.
        </p>
      </div>
    </div>
  );
}
