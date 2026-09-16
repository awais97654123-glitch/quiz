import Link from 'next/link';
import {
  FileText,
  Users,
  Swords,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Play,
  BarChart3,
  Code2,
  ChevronRight,
  Clock,
  Award,
} from 'lucide-react';
import { RoomCodeInput } from '@/components/RoomCodeInput';
import { HeroBackground } from '@/components/HeroBackground';
import { getCourses, getPlatformStats, getUserDashboardStats } from '@/app/actions/quiz';

export default async function HomePage() {
  const [courses, stats, userStats] = await Promise.all([
    getCourses().catch(() => []),
    getPlatformStats(),
    getUserDashboardStats().catch(() => null),
  ]);

  const recentAttempts = userStats?.recentAttempts || [];
  const displayCourses = courses.slice(0, 10);

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden relative">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH FULL-WIDTH INTEGRATED BACKGROUND COMPOSITION         */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28">
        {/* The Seamless Integrated Developer Atmosphere Backdrop */}
        <HeroBackground />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl lg:max-w-3xl space-y-6 text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[#00d9ff] text-xs font-bold tracking-wider backdrop-blur-xl shadow-lg shadow-cyan-950/40">
              <span className="font-mono text-xs font-black">&lt;/&gt;</span>
              <span className="uppercase tracking-widest text-[11px]">The Ultimate Coding Quiz Platform</span>
            </div>

            {/* Main Headline (Bold, Modern, with Strategic Cyan Highlight) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight text-white leading-[1.06]">
              Code Fast.<br />
              <span className="text-[#00d9ff] drop-shadow-[0_0_35px_rgba(0,217,255,0.45)]">
                Challenge Friends.
              </span><br />
              Master Quizzes.
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300/85 leading-relaxed max-w-xl font-normal">
              Sharpen your coding skills with interactive quizzes, compete with friends in real-time, and track your progress — all in one place.
            </p>

            {/* Prominent 6-Digit Join Room Input */}
            <div className="pt-2">
              <RoomCodeInput size="lg" />
            </div>

            {/* Micro Caption */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse" />
              <span>Real-time multiplayer synchronization • 6-digit live room code</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THREE MAIN FEATURE / ACTION CARDS (UNIFIED CYAN DESIGN SYSTEM)         */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* CARD 1: SINGLE QUIZ */}
          <Link
            href="/courses"
            className="group relative rounded-3xl p-6 sm:p-7 bg-[#090f1d]/85 hover:bg-[#0c1527] border border-white/5 hover:border-cyan-500/40 transition-all duration-300 shadow-2xl shadow-black/60 hover:shadow-cyan-950/50 hover:scale-[1.015] flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            {/* Ambient hover top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d9ff]/0 group-hover:via-[#00d9ff]/60 to-transparent transition-all duration-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00d9ff] group-hover:scale-110 group-hover:border-[#00d9ff] transition-all duration-300 shadow-lg shadow-cyan-950/40">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 group-hover:text-[#00d9ff] group-hover:border-cyan-500/40 flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#00d9ff] transition-colors">
                  Single Quiz
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Take a quiz on your own terms.
                </p>
              </div>

              <p className="text-xs text-slate-400/80 leading-relaxed">
                Choose your course, topic, number of questions and difficulty level. Test your knowledge and see your results with detailed analytics.
              </p>
            </div>

            <div className="pt-5 mt-2 border-t border-white/5 flex items-center text-xs font-bold text-[#00d9ff]">
              <span>Start Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* CARD 2: LIVE ROOM */}
          <Link
            href="/create-quiz"
            className="group relative rounded-3xl p-6 sm:p-7 bg-[#090f1d]/85 hover:bg-[#0c1527] border border-white/5 hover:border-cyan-500/40 transition-all duration-300 shadow-2xl shadow-black/60 hover:shadow-cyan-950/50 hover:scale-[1.015] flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d9ff]/0 group-hover:via-[#00d9ff]/60 to-transparent transition-all duration-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00d9ff] group-hover:scale-110 group-hover:border-[#00d9ff] transition-all duration-300 shadow-lg shadow-cyan-950/40">
                  <Users className="w-6 h-6" />
                </div>
                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 group-hover:text-[#00d9ff] group-hover:border-cyan-500/40 flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#00d9ff] transition-colors">
                  Live Room
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Create or join a quiz room.
                </p>
              </div>

              <p className="text-xs text-slate-400/80 leading-relaxed">
                Host a live quiz, share a 6-digit code, watch real-time leaderboards and compete with multiple players.
              </p>
            </div>

            <div className="pt-5 mt-2 border-t border-white/5 flex items-center text-xs font-bold text-[#00d9ff]">
              <span>Create Room</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* CARD 3: 1v1 CHALLENGE */}
          <Link
            href="/challenge-vs"
            className="group relative rounded-3xl p-6 sm:p-7 bg-[#090f1d]/85 hover:bg-[#0c1527] border border-white/5 hover:border-cyan-500/40 transition-all duration-300 shadow-2xl shadow-black/60 hover:shadow-cyan-950/50 hover:scale-[1.015] flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d9ff]/0 group-hover:via-[#00d9ff]/60 to-transparent transition-all duration-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00d9ff] group-hover:scale-110 group-hover:border-[#00d9ff] transition-all duration-300 shadow-lg shadow-cyan-950/40">
                  <Swords className="w-6 h-6" />
                </div>
                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 group-hover:text-[#00d9ff] group-hover:border-cyan-500/40 flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#00d9ff] transition-colors">
                  1v1 Challenge
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Challenge your friends.
                </p>
              </div>

              <p className="text-xs text-slate-400/80 leading-relaxed">
                Search for a friend, send a challenge, accept the request and compete in a 1v1 quiz. Who will be the fastest?
              </p>
            </div>

            <div className="pt-5 mt-2 border-t border-white/5 flex items-center text-xs font-bold text-[#00d9ff]">
              <span>Challenge Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM STATISTICS (REAL DATABASE COUNTS)                             */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="w-full rounded-2xl bg-[#090f1d]/70 border border-white/5 p-6 sm:p-8 backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Metric 1: Active Users */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-[#00d9ff] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.activeUsers}</div>
                <div className="text-xs text-slate-400 font-medium">Active Users</div>
              </div>
            </div>

            {/* Metric 2: Coding Topics */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-[#00d9ff] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.codingTopics}</div>
                <div className="text-xs text-slate-400 font-medium">Coding Topics</div>
              </div>
            </div>

            {/* Metric 3: Quizzes Completed */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-[#00d9ff] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.quizzesCompleted}</div>
                <div className="text-xs text-slate-400 font-medium">Quizzes Completed</div>
              </div>
            </div>

            {/* Metric 4: User Satisfaction */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-[#00d9ff] flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.satisfaction}</div>
                <div className="text-xs text-slate-400 font-medium">User Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. GET STARTED IN 4 SIMPLE STEPS                                          */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-left space-y-2 mb-10">
          <div className="text-xs font-mono font-bold tracking-widest text-[#00d9ff] uppercase">
            — HOW IT WORKS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Get Started in 4 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
            From signup to your first quiz in minutes. It&apos;s simple, fast and fun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#090f1d]/60 border border-white/5 relative group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00d9ff] text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-cyan-500/30">
                1
              </div>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#00d9ff] flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Choose Mode</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select Single Quiz, Create Room, or Challenge a friend.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#090f1d]/60 border border-white/5 relative group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[#00d9ff] font-black text-xs flex items-center justify-center">
                2
              </div>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#00d9ff] flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Configure</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick your course, topic, number of questions and difficulty level.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#090f1d]/60 border border-white/5 relative group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[#00d9ff] font-black text-xs flex items-center justify-center">
                3
              </div>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#00d9ff] flex items-center justify-center">
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              </div>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Play</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Answer interactive coding questions and race against the clock.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-[#090f1d]/60 border border-white/5 relative group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[#00d9ff] font-black text-xs flex items-center justify-center">
                4
              </div>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#00d9ff] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">View Results</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get detailed accuracy analytics and climb the international leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SUPPORTED CODING TRACKS & COURSES                                      */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Popular Coding Tracks</h3>
            <p className="text-xs text-slate-400">Curated question banks from frontend to database systems</p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-[#00d9ff] hover:underline flex items-center gap-1"
          >
            <span>View all tracks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {displayCourses.map((c) => (
            <Link
              key={c.id}
              href={`/quiz/setup/${c.slug}`}
              className="p-4 rounded-2xl bg-[#090f1d]/60 border border-white/5 hover:border-cyan-500/40 hover:bg-[#0c1527] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-[#00d9ff] font-mono text-xs font-bold group-hover:scale-105 transition-transform">
                  {c.icon || <Code2 className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-mono text-slate-500">{c.questionCount}+ Qs</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#00d9ff] transition-colors truncate">
                  {c.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {c.topics ? `${c.topics.length} topics` : 'Core questions'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. RECENT QUIZZES / CONTINUE LEARNING (CONNECTED TO REAL USER HISTORY)    */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090f1d]/80 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#00d9ff]" />
              <h3 className="text-base sm:text-lg font-bold text-white">Recent Activity &amp; Attempts</h3>
            </div>
            {recentAttempts.length > 0 && (
              <Link href="/my-quizzes" className="text-xs font-bold text-[#00d9ff] hover:underline">
                View full history →
              </Link>
            )}
          </div>

          {recentAttempts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {recentAttempts.slice(0, 3).map((attempt) => {
                const percentage = attempt.totalQuestions > 0 ? Math.round((attempt.score / (attempt.totalQuestions * 10)) * 100) : 0;
                return (
                  <div
                    key={attempt.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col justify-between space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[160px]">
                        {attempt.quizName || attempt.categoryName}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#00d9ff]">
                        {attempt.score} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{attempt.correctCount}/{attempt.totalQuestions} Correct</span>
                      <span className="text-emerald-400 font-bold">{percentage}%</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{attempt.completedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Your quiz attempts and duel score history will appear here.
              </p>
              <p className="text-xs text-slate-500">
                Choose a track above or join a live room to start practicing!
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
