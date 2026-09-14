import { getCourses } from '@/app/actions/quiz';
import { CourseCard } from '@/components/CourseCard';
import { BackButton } from '@/components/BackButton';
import { BookOpen, Sparkles, Layers, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses | CodeQuiz',
  description: 'Browse all available technology tracks. Start a quiz in HTML, CSS, JavaScript, React, TypeScript, Python, SQL, or Git.',
};

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative">
      {/* Rich Multi-Colored Ambient Background Mesh for Glass Refraction */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-500/15 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header with Smooth Animated Entrance */}
      <div className="mb-10 animate-fade-in">
        <BackButton fallbackUrl="/" label="Back to Home" className="mb-4" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/15 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Technology Tracks</span>
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
              Choose Your Course
            </h1>
            <p className="text-sm sm:text-base text-slate-300/80 max-w-xl font-normal leading-relaxed">
              Select a specialized technology track to start solo practice or sharpen skills before entering live multiplayer arenas and 1v1 duels.
            </p>
          </div>

          {/* Quick Glass Stats Ribbon */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-xs">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">
                <strong className="text-white font-bold">{courses.length}</strong> Tracks
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-medium">All Skill Levels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Course Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-white/10 glass-panel">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-200 mb-1">No courses available</h3>
          <p className="text-sm text-slate-400">Courses will appear here once the database is seeded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
