import { getCourses } from '@/app/actions/quiz';
import { CoursesClient } from '@/components/CoursesClient';
import { BackButton } from '@/components/BackButton';
import { BookOpen, Sparkles, Layers, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology Tracks | CodeQuiz Arena',
  description: 'Browse interactive programming courses. Practice solo coding concepts or sharpen knowledge across HTML, CSS, JavaScript, React, TypeScript, Python, SQL, and Git.',
};

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative">
      {/* Radiant Glass Refraction Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-500/15 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header with Smooth Animated Entrance */}
      <div className="mb-8 sm:mb-10 animate-fade-in">
        <BackButton fallbackUrl="/" label="Back to Home" className="mb-4" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-cyan-500/10">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Technology Tracks</span>
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
              Choose Your Track
            </h1>
            <p className="text-xs sm:text-base text-slate-300/85 max-w-2xl font-normal leading-relaxed">
              Select a specialized technology course to start randomized solo practice, master technical concepts, or sharpen skills before entering live multiplayer arenas and 1v1 duels.
            </p>
          </div>

          {/* Quick Glass Stats Ribbon */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-xs">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">
                <strong className="text-white font-bold">{courses.length}</strong> Tracks
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-medium">Olympic MMR Ranked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Client Search & Filter Grid */}
      <CoursesClient initialCourses={courses} />
    </div>
  );
}
