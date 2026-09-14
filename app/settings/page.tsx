import { redirect } from 'next/navigation';
import { getAuthUser } from '@/app/actions/auth';
import { BackButton } from '@/components/BackButton';
import Link from 'next/link';
import {
  Settings,
  User,
  Shield,
  Camera,
  Mail,
  GraduationCap,
  Code2,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import { AppSettingsClient } from '@/components/AppSettingsClient';

export const metadata: Metadata = {
  title: 'Settings & Preferences | CodeQuiz Arena',
  description: 'Manage your audio sound effects, background music, quiz gameplay speeds, and duel notifications.',
};

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getAuthUser();

  const displayName = user?.name || 'Developer';
  const displayEmail = user?.email || 'guest@codequiz.dev';
  const displayUsername = user?.username ? `@${user.username}` : '@guest';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <BackButton fallbackUrl="/profile" label="Back to Profile" />

      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4" />
            <span>Preferences &amp; Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Application <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your audio synthesizer, answering speed, 1v1 duel invite notifications, and display modes.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {/* Account Info Strip */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md shrink-0 overflow-hidden">
            {user?.avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.avatar}
                alt={displayName}
                className="w-full h-full object-cover rounded-[10px]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-lg text-white bg-slate-950 rounded-[10px]">
                {displayName[0]?.toUpperCase() || 'D'}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{displayName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {displayUsername}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-500" />
              <span>{displayEmail}</span>
            </div>
          </div>
        </div>

        <Link
          href="/profile/edit-avatar"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all shadow-sm flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Edit Avatar &amp; Photo</span>
        </Link>
      </div>

      {/* Real Interactive Settings Component */}
      <AppSettingsClient />
    </div>
  );
}
