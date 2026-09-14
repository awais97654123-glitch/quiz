'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  BookOpen,
  PlusCircle,
  Users,
  ClipboardList,
  Menu,
  X,
  Zap,
  LogIn,
  User,
  LogOut,
  Swords,
  Trophy,
  Settings,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/challenge-vs', label: 'Challenge', icon: Swords },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Handle clicking outside to smoothly close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileDropdownOpen]);

  // Close dropdown & mobile drawer on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const confirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      setShowSignOutModal(false);
      setProfileDropdownOpen(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const isAuthed = !loading && !!user;
  const displayName = isAuthed
    ? (user?.user_metadata?.full_name ||
       user?.user_metadata?.name ||
       user?.email?.split('@')[0] ||
       'Developer')
    : 'Guest Developer';
  const username = isAuthed
    ? (user?.user_metadata?.username
        ? `@${user.user_metadata.username}`
        : user?.email || '@developer')
    : '@guest';
  const avatarUrl = isAuthed ? user?.user_metadata?.avatar_url : undefined;

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  // Hide Navbar completely on all quiz modes, countdowns, rooms, and active battle arenas
  const isQuizMode =
    pathname.startsWith('/quiz') ||
    pathname.startsWith('/room') ||
    (pathname.startsWith('/challenge-vs/') && pathname !== '/challenge-vs');

  if (isQuizMode) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-black text-xs text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            &lt;/&gt;
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tight text-white">
            Code<span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Quiz</span>
          </span>
        </Link>

        {/* Desktop Nav: Home, Courses, Challenge, Leaderboard */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Profile Dropdown & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Profile Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className={`text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full transition-all shadow-sm cursor-pointer select-none ${
                profileDropdownOpen
                  ? 'bg-slate-850 border-2 border-cyan-400 ring-2 ring-cyan-500/25 shadow-cyan-500/20 shadow-md'
                  : 'bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850/80'
              }`}
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
              id="profile-dropdown-btn"
            >
              {isAuthed && avatarUrl && !avatarError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={displayName}
                  onError={() => setAvatarError(true)}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-400/40"
                />
              ) : isAuthed ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-black text-[11px] sm:text-xs flex items-center justify-center shadow-sm">
                  {displayName[0]?.toUpperCase() || 'D'}
                </div>
              ) : (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-sm">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              )}
              <span className="font-semibold text-slate-200 max-w-[90px] sm:max-w-[130px] truncate">
                {isAuthed ? displayName : 'Profile'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  profileDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>

            {/* Glassmorphic Dropdown Menu: Profile, Dashboard, Settings, Sign Out / Sign In */}
            <div
              className={`absolute right-0 mt-2.5 w-64 rounded-2xl bg-slate-900/95 border border-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-cyan-950/40 p-2 z-50 origin-top-right transition-all duration-200 ease-out ${
                profileDropdownOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
              }`}
              role="menu"
              aria-orientation="vertical"
            >
              {/* Header Preview */}
              <div className="px-3 py-2.5 mb-1.5 rounded-xl bg-slate-950/70 border border-slate-800/70 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{displayName}</div>
                  <div className="text-[11px] font-mono text-cyan-400 truncate mt-0.5">
                    {username}
                  </div>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-2 ${
                    isAuthed
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isAuthed ? 'Online' : 'Guest'}
                </span>
              </div>

              {/* Dropdown Action Items */}
              <div className="space-y-1">
                {/* 1. Profile Option */}
                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    pathname === '/profile'
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">Profile</div>
                    <div className="text-[10px] text-slate-400 truncate">Stats, rankings &amp; badges</div>
                  </div>
                </Link>

                {/* 2. Settings Option */}
                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    pathname === '/settings'
                      ? 'text-amber-300 bg-amber-950/60 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850/80'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors">Settings</div>
                    <div className="text-[10px] text-slate-400 truncate">Sound, audio &amp; preferences</div>
                  </div>
                </Link>
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-slate-800/80" />

              {/* 4. Sign Out / Login Link */}
              {isAuthed ? (
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setShowSignOutModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Sign Out</div>
                    <div className="text-[10px] text-rose-400/70">Disconnect session</div>
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/10 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Login / Sign In</div>
                    <div className="text-[10px] text-slate-400">Save progress &amp; compete</div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Login button if not authenticated */}
          {!isAuthed && (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-1">
            {/* Core Nav Links: Home, Courses, Challenge, Leaderboard */}
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Profile Dropdown Items in Mobile */}
            <div className="pt-3 mt-2 border-t border-slate-800 space-y-1">
              <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Account &amp; Workspace
              </div>

              {/* Profile */}
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/profile'
                    ? 'text-cyan-400 bg-cyan-500/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850/60'
                }`}
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Profile</span>
              </Link>

              {/* Settings */}
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/settings'
                    ? 'text-amber-400 bg-amber-500/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850/60'
                }`}
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Settings</span>
              </Link>

              {/* Sign Out / Login */}
              {isAuthed ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setShowSignOutModal(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Sign In</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Sign Out Permission Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in select-none">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center space-y-4 shadow-2xl shadow-rose-950/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">
                Sign Out of CodeQuiz?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to sign out? You will need to sign back in to access saved scores and private rooms.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                disabled={isSigningOut}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmSignOut}
                disabled={isSigningOut}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSigningOut ? (
                  <span>Signing out...</span>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Yes, Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
