'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  BookOpen,
  Hash,
  Swords,
  PlusCircle,
  Trophy,
  FolderGit2,
  PanelLeftClose,
  User,
  Settings,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';
import { useUser } from '@/lib/supabase/useUser';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Tracks', icon: BookOpen },
  { href: '/join-quiz', label: 'Join Quiz', icon: Hash, badge: 'Live', highlight: true },
  { href: '/challenge-vs', label: '1v1 Arena', icon: Swords },
  { href: '/create-quiz', label: 'Create Quiz', icon: PlusCircle },
  { href: '/leaderboard', label: 'Podium', icon: Trophy },
  { href: '/my-quizzes', label: 'My Quizzes', icon: FolderGit2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Desktop sidebar collapse state (persisted in localStorage)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Bottom profile drop-up state
  const [profileDropUpOpen, setProfileDropUpOpen] = useState(false);
  const dropUpRef = useRef<HTMLDivElement>(null);

  // Sign out modal state
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Initialize collapse preference from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('cq_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Update localStorage and broadcast resize event whenever collapsed state changes
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cq_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      // Broadcast custom event so layout/main padding adjusts with perfect sync
      window.dispatchEvent(new CustomEvent('cq-sidebar-change', { detail: { isCollapsed: next } }));
      return next;
    });
  };

  // Close drop-up & mobile drawer on path change
  useEffect(() => {
    setProfileDropUpOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Click outside to close drop-up menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropUpRef.current && !dropUpRef.current.contains(event.target as Node)) {
        setProfileDropUpOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropUpOpen(false);
      }
    };

    if (profileDropUpOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileDropUpOpen]);

  // Handle Logout
  const confirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { logoutUser } = await import('@/app/actions/auth');
      await logoutUser();
      window.dispatchEvent(new Event('cq-auth-change'));
      setShowSignOutModal(false);
      setProfileDropUpOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const isAuthed = isLoaded && !!user;
  const displayName = isAuthed
    ? user?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer'
    : 'Guest Developer';
  const username = isAuthed
    ? user?.username
      ? `@${user.username}`
      : user?.user_metadata?.username
      ? `@${user.user_metadata.username}`
      : user?.email || '@developer'
    : '@guest';
  const avatarUrl = isAuthed ? user?.avatar || user?.user_metadata?.avatar_url : undefined;

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  // Hide entirely during active timed quiz mode
  const isQuizMode = pathname.startsWith('/quiz/play');
  if (isQuizMode) {
    return null;
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE TOP HEADER (< md)
          Displays graduation cap logo + mobile hamburger trigger
          ───────────────────────────────────────────────────────────── */}
      <div className="md:hidden sticky top-0 z-40 w-full h-14 bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 px-4 flex items-center justify-between transition-colors">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform p-1">
            <Image
              src="/graduation-cap.svg"
              alt="CodeQuiz"
              width={28}
              height={28}
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              priority
            />
          </div>
          <span className="text-base font-black tracking-tight text-white flex items-center gap-0.5">
            Code<span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Quiz</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Backdrop with silky fade */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP & MOBILE SIDEBAR CONTAINER
          Ultra-fluid, GPU-accelerated glassmorphic panel
          ───────────────────────────────────────────────────────────── */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-2xl border-r border-white/10 shadow-2xl shadow-cyan-950/30 select-none transform-gpu will-change-[width,transform] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${/* Mobile Drawer positioning */ ''}
          ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${/* Desktop Collapsed vs Expanded */ ''}
          ${mounted && !isCollapsed ? 'md:w-64' : 'md:w-[74px]'}
        `}
      >
        {/* Subtle Radiant Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

        {/* ── TOP SECTION: LOGO + APPLICATION NAME (WHEN OPEN) + TOGGLE ── */}
        <div className="p-3 border-b border-white/5 relative shrink-0">
          <div
            className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isCollapsed && !mobileOpen ? 'flex-col justify-center gap-2.5' : 'justify-between'
            }`}
          >
            {/* Logo Link + Application Name */}
            <Link
              href="/"
              title="CodeQuiz Arena"
              className="flex items-center gap-3 min-w-0 group"
            >
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-sky-500/15 to-indigo-600/25 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:border-cyan-300 group-hover:scale-105 group-hover:shadow-cyan-400/40 transition-all duration-300 p-1.5">
                <Image
                  src="/graduation-cap.svg"
                  alt="CodeQuiz Graduation Cap"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                  priority
                />
              </div>

              {/* 
                Application Name:
                When sidebar is OPEN (Expanded): Smoothly slides and fades in
                When sidebar is CLOSED (Collapsed): Smoothly collapses and fades out
              */}
              <div
                className={`flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isCollapsed && !mobileOpen
                    ? 'opacity-0 max-w-0 -translate-x-3 pointer-events-none'
                    : 'opacity-100 max-w-[150px] translate-x-0'
                }`}
              >
                <span className="text-base font-black tracking-tight text-white whitespace-nowrap leading-none flex items-center gap-0.5">
                  Code<span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Quiz</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80 tracking-wider uppercase font-semibold mt-1 whitespace-nowrap">
                  Arena Duel
                </span>
              </div>
            </Link>

            {/* Classic Open / Close Toggle Button (Placed with smooth rotate animation) */}
            <button
              type="button"
              onClick={toggleCollapse}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-slate-400 hover:text-cyan-300 transition-all duration-300 cursor-pointer shadow-sm group shrink-0"
            >
              <PanelLeftClose
                className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isCollapsed ? 'rotate-180 text-cyan-400' : 'rotate-0 text-slate-400 group-hover:text-cyan-300'
                }`}
              />
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── MIDDLE SECTION: NAVIGATION LINKS (SILKY SMOOTH TRANSITIONS) ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`group relative flex items-center rounded-xl font-medium text-xs h-11 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${isCollapsed ? 'justify-center px-2.5' : 'gap-3 px-3'}
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/35 shadow-md shadow-cyan-500/10 font-bold'
                      : item.highlight
                      ? 'bg-cyan-950/30 text-slate-200 border border-cyan-500/20 hover:bg-cyan-500/15 hover:text-cyan-300 hover:border-cyan-400/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] border border-transparent'
                  }
                `}
              >
                {/* Active Indicator Bar on left */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}

                {/* Classic Icon with subtle scale-on-hover */}
                <div
                  className={`shrink-0 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
                    isActive
                      ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                      : item.highlight
                      ? 'text-cyan-400'
                      : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* 
                  Text Label & Badge:
                  Retained in DOM with smooth max-width, opacity, and transform transition
                  Avoids sudden DOM popping for buttery 60fps smoothness!
                */}
                <div
                  className={`flex items-center justify-between flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isCollapsed && !mobileOpen
                      ? 'opacity-0 max-w-0 -translate-x-2 pointer-events-none'
                      : 'opacity-100 max-w-[180px] translate-x-0'
                  }`}
                >
                  <span className="truncate tracking-wide whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-sm shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Floating Tooltip when Collapsed on Desktop */}
                {isCollapsed && (
                  <div className="hidden md:group-hover:flex absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900/95 border border-cyan-500/30 text-slate-100 text-xs font-semibold rounded-lg whitespace-nowrap shadow-2xl shadow-black/60 z-50 pointer-events-none items-center gap-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── BOTTOM SECTION: USER PROFILE & DROP-UP MENU ── */}
        <div className="p-2 border-t border-white/5 relative shrink-0" ref={dropUpRef}>
          {/* 
            Bottom-to-Top Drop-Up Menu
            Opens above the profile avatar button with silky spring entry
          */}
          {profileDropUpOpen && (
            <div
              className={`absolute bottom-full mb-2.5 rounded-2xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-2xl shadow-2xl shadow-cyan-950/60 p-2 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-3 duration-200 ease-out
                ${isCollapsed && !mobileOpen ? 'left-2 w-60' : 'left-2 right-2'}
              `}
              role="menu"
            >
              {/* Header Preview inside Drop-up */}
              <div className="px-3 py-2.5 mb-1.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{displayName}</div>
                  <div className="text-[10px] font-mono text-cyan-400 truncate mt-0.5">
                    {username}
                  </div>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-2 ${
                    isAuthed
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isAuthed ? 'Online' : 'Guest'}
                </span>
              </div>

              {/* Action Items */}
              <div className="space-y-1">
                {/* 1. Profile Option */}
                <Link
                  href="/profile"
                  onClick={() => setProfileDropUpOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    pathname === '/profile'
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      Profile
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">Stats, badges &amp; history</div>
                  </div>
                </Link>

                {/* 2. Settings Option */}
                <Link
                  href="/settings"
                  onClick={() => setProfileDropUpOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    pathname === '/settings'
                      ? 'text-amber-300 bg-amber-950/60 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      Settings
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">Sound, audio &amp; prefs</div>
                  </div>
                </Link>
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-white/10" />

              {/* Sign In / Sign Out Button */}
              {isAuthed ? (
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropUpOpen(false);
                    setShowSignOutModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
                    <LogOut className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Sign Out</div>
                    <div className="text-[9px] text-rose-400/70">Disconnect session</div>
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setProfileDropUpOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                    <LogIn className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Sign In</div>
                    <div className="text-[9px] text-slate-400">Save progress &amp; duel</div>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Profile Button / Trigger */}
          <button
            type="button"
            onClick={() => setProfileDropUpOpen((prev) => !prev)}
            title={displayName}
            className={`w-full flex items-center rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer p-1.5 border
              ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}
              ${
                profileDropUpOpen
                  ? 'bg-slate-850 border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-white/10'
              }
            `}
          >
            {/* User Avatar */}
            <div className="relative shrink-0">
              {isAuthed && avatarUrl && !avatarError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={displayName}
                  onError={() => setAvatarError(true)}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-400/50 shadow-md"
                />
              ) : isAuthed ? (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-cyan-500/20 border border-white/10">
                  {displayName[0]?.toUpperCase() || 'D'}
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
              {/* Online indicator dot */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                  isAuthed ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
            </div>

            {/* User Name & Handle when expanded with silky sliding fade */}
            <div
              className={`flex-1 min-w-0 text-left overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isCollapsed && !mobileOpen
                  ? 'opacity-0 max-w-0 -translate-x-2 pointer-events-none'
                  : 'opacity-100 max-w-[150px] translate-x-0'
              }`}
            >
              <div className="text-xs font-bold text-white truncate leading-tight whitespace-nowrap">
                {displayName}
              </div>
              <div className="text-[10px] text-cyan-400 truncate font-mono whitespace-nowrap">
                {username}
              </div>
            </div>

            {/* Drop-up arrow indicator */}
            {(!isCollapsed || mobileOpen) && (
              <ChevronUp
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  profileDropUpOpen ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            )}
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          3. SIGN OUT CONFIRMATION MODAL
          ───────────────────────────────────────────────────────────── */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl shadow-cyan-950/50 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white">Sign Out of CodeQuiz?</h3>
              <p className="text-xs text-slate-400">
                You will need to sign back in to participate in 1v1 duels and save leaderboard MMR points.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                disabled={isSigningOut}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSignOut}
                disabled={isSigningOut}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
