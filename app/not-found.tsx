import Link from 'next/link';
import { Home, BookOpen, Users, Trophy, Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
        {/* Neon 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 animate-spin" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* 404 Big Numbers */}
        <h1 className="font-mono text-7xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 select-none">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Lost in Cyberspace?
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            The page you are looking for has been moved, renamed, or never existed in this realm.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="pt-4 grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
          <Link
            href="/"
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all group flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Home Arena
              </div>
              <div className="text-[10px] text-slate-400">Back to start</div>
            </div>
          </Link>

          <Link
            href="/courses"
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 transition-all group flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                Courses
              </div>
              <div className="text-[10px] text-slate-400">Tech tracks</div>
            </div>
          </Link>

          <Link
            href="/join-quiz"
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-all group flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Join Quiz
              </div>
              <div className="text-[10px] text-slate-400">8-digit code</div>
            </div>
          </Link>

          <Link
            href="/leaderboard"
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 transition-all group flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Leaderboard
              </div>
              <div className="text-[10px] text-slate-400">Global ranks</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
