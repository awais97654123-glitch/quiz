import Link from 'next/link';
import Image from 'next/image';
import { RoomCodeInput } from '@/components/RoomCodeInput';
import {
  Zap,
  Users,
  Trophy,
  ArrowRight,
  Code2,
  Volume2,
  Sparkles,
  Swords,
  Target,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12 space-y-8 sm:space-y-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: 2-COLUMN DISPLAY MATCHING EXACT MOCKUP                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT COLUMN: HEADLINE, DESCRIPTION & ROOM INPUT */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Top Status Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-bold tracking-wider backdrop-blur-xl shadow-lg shadow-cyan-500/10">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400 shrink-0" />
                <span>LIVE DEVELOPER BATTLEGROUND</span>
              </span>
              <span className="text-slate-600 hidden xs:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-rose-300">1v1 DUELS &amp; GLOBAL LEADERBOARD</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[72px] font-black tracking-tight text-white leading-[1.08] sm:leading-[1.04]">
              Code Fast.<br />
              <span className="text-[#00e5ff] drop-shadow-[0_0_35px_rgba(0,229,255,0.45)]">
                Challenge Friends.
              </span><br />
              Dominate Quizzes.
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-base text-slate-300/85 leading-relaxed max-w-lg font-normal">
              The competitive coding quiz arena. Test your knowledge across core programming tracks, challenge peers in live 1v1 duels, and host interactive multiplayer rooms.
            </p>

            {/* 8-Digit Room Code Input Box */}
            <div className="w-full max-w-md pt-1">
              <RoomCodeInput size="lg" />
            </div>

            {/* Helper Caption */}
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-cyan-400 pt-0.5">
              <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400 shrink-0" />
              <span>Instant live join • Real-time multiplayer synchronization</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D DEVELOPER ARENA LAPTOP VISUAL */}
          <div className="lg:col-span-5 flex items-center justify-center relative mt-2 lg:mt-0">
            {/* Ambient Multi-Color Radial Glows */}
            <div className="absolute w-60 sm:w-80 h-60 sm:h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
            <div className="absolute -top-6 right-6 w-48 sm:w-60 h-48 sm:h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Container for 3D Visual with Floating Badges */}
            <div className="relative w-full max-w-[320px] sm:max-w-[440px] aspect-square rounded-3xl overflow-hidden p-2">
              {/* Floating Purple "Think • Code • Win" Pill */}
              <div className="absolute top-4 right-4 sm:right-6 z-20 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white text-[10px] sm:text-[11px] font-extrabold shadow-xl shadow-purple-500/50 border border-purple-400/50 flex items-center gap-1.5 backdrop-blur-md animate-pulse">
                <Sparkles className="w-3 h-3 text-purple-200" />
                <span>Think • Code • Win</span>
              </div>

              {/* High-Fidelity 3D Laptop Hero Asset */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/60 border border-cyan-500/20">
                <Image
                  src="/hero-laptop.jpg"
                  alt="CodeQuiz Multiplayer Arena 3D"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  priority
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating 3D Glowing Cube Overlay */}
              <div className="absolute bottom-6 sm:bottom-10 left-3 sm:left-4 z-20 w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-indigo-600/40 border border-cyan-400/60 backdrop-blur-xl flex items-center justify-center shadow-xl shadow-cyan-500/40 animate-bounce">
                <span className="font-mono font-black text-white text-sm sm:text-base drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  &lt;/&gt;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TWO MASSIVE PRIMARY FEATURE ACTION CARDS                               */}
        {/* ========================================================================= */}
        <div className="relative">
          {/* Playful Hand-Drawn Style Doodle Accents */}
          <div className="hidden lg:block absolute -left-7 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none select-none opacity-80 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 18c4-6 10-6 14-2" />
              <path d="M14 16l4 4-2-6" />
            </svg>
          </div>

          <div className="hidden lg:block absolute -right-7 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none select-none opacity-80 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 18c-4-6-10-6-14-2" />
              <path d="M10 16l-4 4 2-6" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            {/* CARD 1: SINGLE QUIZ (Vibrant Cyan / Blue Gradient) */}
            <Link
              href="/courses"
              className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#00b4d8] via-[#0096c7] to-[#0077b6] hover:from-[#00c4ea] hover:via-[#00a8dc] hover:to-[#0088cc] transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.015] flex items-center justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 fill-white text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    Single Quiz
                  </h3>
                  <p className="text-xs text-sky-100/90 font-semibold mt-0.5">
                    Solve &amp; Practice
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#003566]/60 border border-white/25 text-white flex items-center justify-center shrink-0 group-hover:translate-x-1.5 transition-transform shadow-lg relative z-10">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* CARD 2: 1v1 CHALLENGE VS (Fiery Crimson / Neon Rose Gradient) */}
            <Link
              href="/challenge-vs"
              className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#e63946] via-[#f72585] to-[#7209b7] hover:from-[#f94144] hover:via-[#b5179e] hover:to-[#560bad] transition-all duration-300 shadow-2xl shadow-rose-500/30 hover:shadow-rose-400/50 hover:scale-[1.015] flex items-center justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight flex items-center gap-1.5">
                    <span>Friend Room</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">1v1 Duel</span>
                  </h3>
                  <p className="text-xs text-rose-100/90 font-semibold mt-0.5">
                    Challenge Friends by Username
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-white/25 text-white flex items-center justify-center shrink-0 group-hover:translate-x-1.5 transition-transform shadow-lg relative z-10">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* CARD 3: CREATE ROOM (Vibrant Neon Purple / Violet Gradient) */}
            <Link
              href="/create-quiz"
              className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#8a2be2] via-[#7b2cbf] to-[#6a0dad] hover:from-[#9d4edd] hover:via-[#873bcc] hover:to-[#791fb8] transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-400/50 hover:scale-[1.015] flex items-center justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    Create Room
                  </h3>
                  <p className="text-xs text-purple-100/90 font-semibold mt-0.5">
                    Multiplayer Quiz Party
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#240046]/60 border border-white/25 text-white flex items-center justify-center shrink-0 group-hover:translate-x-1.5 transition-transform shadow-lg relative z-10">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM METRICS / FEATURE RIBBON                                        */}
        {/* ========================================================================= */}
        <div className="w-full rounded-2xl sm:rounded-full bg-[#070e1c]/90 border border-slate-800/80 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-4">
            
            {/* Metric 1: Multi-Track Tech Stacks */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-sm shadow-cyan-500/20">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-white truncate">8+ Tech Stacks</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">JavaScript, React &amp; Web</div>
              </div>
            </div>

            {/* Metric 2: 1v1 Realtime Friend Duels */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20">
                <Swords className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-white truncate">1v1 Friend Duels</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Head-to-Head Battles</div>
              </div>
            </div>

            {/* Metric 3: Top 10 Global Board */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-white truncate">Top 10 Global Board</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Olympic Podium &amp; Decay</div>
              </div>
            </div>

            {/* Metric 4: Live MMR & Radial Analytics */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                <Target className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-white truncate">Live Performance MMR</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Accuracy, Speed &amp; Rings</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
