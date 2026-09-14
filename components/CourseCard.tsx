'use client';

import Link from 'next/link';
import {
  FileCode2, Palette, Zap, Atom, Code2, Terminal, GitBranch, Database, ArrowRight, HelpCircle,
} from 'lucide-react';

interface CourseData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  badge: string | null;
  topics: string[];
  questionCount: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileCode2, Palette, Zap, Atom, Code2, Terminal, GitBranch, Database,
};

export function CourseCard({
  course,
  linkPrefix = '/quiz/setup',
  index = 0,
}: {
  course: CourseData;
  linkPrefix?: string;
  index?: number;
}) {
  const IconComponent = ICON_MAP[course.icon] || Code2;

  return (
    <div
      className="group relative flex flex-col justify-between glass-card rounded-3xl p-6 transition-all duration-500 hover:scale-[1.03] animate-card-entrance cursor-pointer"
      style={{
        animationDelay: `${index * 85 + 60}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Dynamic ambient color glow behind the card matching course track */}
      <div
        className="absolute -top-10 -left-10 w-36 h-36 rounded-full blur-3xl opacity-25 pointer-events-none group-hover:opacity-60 transition-opacity duration-500"
        style={{
          background: course.color.includes('cyan')
            ? '#06b6d4'
            : course.color.includes('purple') || course.color.includes('indigo')
            ? '#8b5cf6'
            : course.color.includes('amber') || course.color.includes('orange')
            ? '#f59e0b'
            : course.color.includes('emerald') || course.color.includes('green')
            ? '#10b981'
            : '#3b82f6',
        }}
      />

      {/* Glass diagonal shimmer accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${course.color} text-white shadow-xl shadow-black/60 border border-white/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          >
            <IconComponent className="w-7 h-7 drop-shadow-md" />
          </div>
          {course.badge && (
            <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-white/[0.08] backdrop-blur-md text-cyan-300 border border-white/15 rounded-full shadow-inner">
              {course.badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors mb-2 tracking-tight">
          {course.name}
        </h3>
        <p className="text-xs text-slate-300/85 line-clamp-2 leading-relaxed mb-5 font-normal">
          {course.description}
        </p>

        {course.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {course.topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[10px] font-medium bg-white/[0.05] backdrop-blur-md text-slate-200 border border-white/10 rounded-lg shadow-sm hover:bg-white/[0.1] transition-colors"
              >
                {topic}
              </span>
            ))}
            {course.topics.length > 3 && (
              <span className="px-2 py-1 text-[10px] font-semibold text-cyan-300 bg-cyan-500/15 rounded-lg border border-cyan-500/25">
                +{course.topics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/[0.08] mt-2 relative z-10">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            {course.questionCount} Questions
          </span>
          <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Practice Track
          </span>
        </div>

        <Link
          href={`${linkPrefix}/${course.slug}`}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all duration-300 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/45 cursor-pointer"
        >
          <span>Start Quiz</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
