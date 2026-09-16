'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, User, Settings, LogOut, LogIn, Swords } from 'lucide-react';
import { useUser } from '@/lib/supabase/useUser';
import { CourseSearch } from './CourseSearch';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setDropdownOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      const { logoutUser } = await import('@/app/actions/auth');
      await logoutUser();
      window.dispatchEvent(new Event('cq-auth-change'));
      setDropdownOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isAuthed = isLoaded && !!user;
  const displayName = isAuthed
    ? user?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer'
    : 'Guest';
  const username = isAuthed
    ? user?.username
      ? `@${user.username}`
      : user?.user_metadata?.username
      ? `@${user.user_metadata.username}`
      : user?.email || '@developer'
    : '@guest';
  const avatarUrl = isAuthed ? user?.avatar || user?.user_metadata?.avatar_url : undefined;

  // Hide in quiz play mode
  if (pathname.startsWith('/quiz/play')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#070b14]/80 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 select-none">
      {/* ── LEFT: LOGO / QUIZCODE BRANDING ── */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/15 to-indigo-600/25 border border-cyan-400/40 flex items-center justify-center shadow-md shadow-cyan-500/20 p-1 group-hover:scale-105 transition-transform">
            <span className="font-mono font-black text-xs text-[#00d9ff]">&lt;/&gt;</span>
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center">
            Quiz<span className="text-[#00d9ff]">Code</span>
          </span>
        </Link>

        {/* Tagline Badge (as shown in reference design) */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono font-medium text-slate-400 pl-2 border-l border-white/10">
          <span>Learn</span>
          <span className="text-[#00d9ff]">•</span>
          <span>Practice</span>
          <span className="text-[#00d9ff]">•</span>
          <span>Compete</span>
        </div>
      </div>

      {/* ── CENTER: INTERACTIVE LIVE COURSE SEARCH ── */}
      <div className="flex-1 flex justify-center max-w-xl mx-auto px-2">
        <CourseSearch />
      </div>

      {/* ── RIGHT: NOTIFICATIONS & USER PROFILE ── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            title="Notifications"
            className="w-9 h-9 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            {/* Active notification indicator */}
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00d9ff] ring-2 ring-[#070b14] animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] font-mono text-[#00d9ff]">Live Arena</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/15 text-[#00d9ff] flex items-center justify-center shrink-0 mt-0.5">
                    <Swords className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-[11px]">1v1 Duel Arena Active</p>
                    <p className="text-[10px] text-slate-400">Challenge any friend by username in real-time.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            {/* Avatar */}
            {isAuthed && avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-400/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                {displayName[0]?.toUpperCase() || 'A'}
              </div>
            )}

            <span className="text-xs font-bold text-white max-w-[90px] truncate hidden sm:inline">
              {displayName}
            </span>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#00d9ff]' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <div className="text-xs font-bold text-white truncate">{displayName}</div>
                <div className="text-[10px] font-mono text-[#00d9ff] truncate">{username}</div>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Profile &amp; Stats</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </Link>

                {isAuthed ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
