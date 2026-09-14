'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCode2,
  Palette,
  Zap,
  Atom,
  Code2,
  Terminal,
  GitBranch,
  Database,
  ArrowRight,
  Search,
  HelpCircle,
  Timer,
} from 'lucide-react';

interface CategoryItem {
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
  FileCode2,
  Palette,
  Zap,
  Atom,
  Code2,
  Terminal,
  GitBranch,
  Database,
};

export function CategoryGrid({
  categories,
  initialSearch = '',
}: {
  categories: CategoryItem[];
  initialSearch?: string;
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedBadge, setSelectedBadge] = useState<string>('ALL');

  // Extract unique badges for filter pills
  const badges = useMemo(() => {
    const all = categories
      .map((c) => c.badge)
      .filter((b): b is string => Boolean(b));
    return ['ALL', ...Array.from(new Set(all))];
  }, [categories]);

  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBadge =
        selectedBadge === 'ALL' || cat.badge === selectedBadge;

      return matchesSearch && matchesBadge;
    });
  }, [categories, searchTerm, selectedBadge]);

  return (
    <div id="courses" className="w-full space-y-8 scroll-mt-24">
      {/* Search & Filter Header (Glassmorphic) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-xl">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracks, topics (e.g. flexbox, promises, joins)..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 backdrop-blur-md transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 bg-white/10 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0 touch-pan-x">
          {badges.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBadge(b)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedBadge === b
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/25 ring-1 ring-cyan-300'
                  : 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] border border-white/10 backdrop-blur-md'
              }`}
            >
              {b === 'ALL' ? 'All Tracks' : b}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid (Glass Cards with Staggered Entrance) */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-white/10 glass-panel backdrop-blur-xl">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-200 mb-1">No matching tracks found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
            Try searching for another topic like &ldquo;HTML&rdquo;, &ldquo;React&rdquo;, or &ldquo;JavaScript&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedBadge('ALL');
            }}
            className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-white/15 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((cat, index) => {
            const IconComponent = ICON_MAP[cat.icon] || Code2;
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between glass-card rounded-3xl p-5 sm:p-6 transition-all duration-400 hover:scale-[1.025] animate-card-entrance cursor-pointer"
                style={{
                  animationDelay: `${index * 70}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Dynamic colored glow matching track */}
                <div
                  className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                  style={{
                    background: cat.color.includes('cyan')
                      ? '#06b6d4'
                      : cat.color.includes('purple') || cat.color.includes('indigo')
                      ? '#8b5cf6'
                      : cat.color.includes('amber') || cat.color.includes('orange')
                      ? '#f59e0b'
                      : '#3b82f6',
                  }}
                />

                <div className="relative z-10">
                  {/* Top row: Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-xl shadow-black/50 border border-white/25 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6 drop-shadow-md" />
                    </div>
                    {cat.badge && (
                      <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-white/[0.08] backdrop-blur-md text-cyan-300 border border-white/15 rounded-full shadow-inner">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors mb-2 tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300/85 line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Topics Chips */}
                  {cat.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {cat.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[10px] font-medium bg-white/[0.05] backdrop-blur-md text-slate-200 border border-white/10 rounded-lg shadow-sm"
                        >
                          {topic}
                        </span>
                      ))}
                      {cat.topics.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold text-cyan-300 bg-cyan-500/15 rounded-lg border border-cyan-500/25">
                          +{cat.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom info & Action */}
                <div className="pt-4 border-t border-white/[0.08] mt-2 relative z-10">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      {cat.questionCount} Questions
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      10 Qs / Test
                    </span>
                  </div>

                  <Link
                    href={`/quiz/${cat.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all duration-300 shadow-md hover:shadow-cyan-500/30"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
