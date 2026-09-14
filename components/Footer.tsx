'use client';

import { Zap, Code2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Hide Footer completely on all quiz modes, rooms, and active battle arenas
  const isQuizMode =
    pathname.startsWith('/quiz') ||
    pathname.startsWith('/room') ||
    (pathname.startsWith('/challenge-vs/') && pathname !== '/challenge-vs');

  if (isQuizMode) {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/10 glass-panel backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-white/20">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="text-base font-black bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                CodeQuiz Arena
              </span>
              <div className="text-[10px] text-slate-400 font-mono">
                Interactive Developer Battles
              </div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-400 flex-wrap justify-center">
            <Link href="/courses" className="hover:text-cyan-300 transition-colors">Courses</Link>
            <Link href="/challenge-vs" className="hover:text-rose-400 transition-colors">1v1 Duel</Link>
            <Link href="/leaderboard" className="hover:text-amber-300 transition-colors">Leaderboard</Link>
            <Link href="/create-quiz" className="hover:text-purple-400 transition-colors">Create Room</Link>
            <Link href="/join-quiz" className="hover:text-cyan-300 transition-colors">Join Quiz</Link>
            <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
          </div>

          {/* Developer & Company Credit Badge */}
          <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs text-slate-300 shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Created by <strong className="text-white font-bold">Malik Software</strong></span>
              <span className="text-slate-500">•</span>
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dev: <strong className="text-cyan-300 font-bold">malikabubakkar</strong></span>
            </div>

            <p className="text-[11px] text-slate-400/80">
              © {new Date().getFullYear()} CodeQuiz. Powered by Malik Software.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
