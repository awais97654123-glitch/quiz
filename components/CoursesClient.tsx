'use client';

import { useState, useMemo } from 'react';
import { CourseCard } from '@/components/CourseCard';
import { Search, BookOpen, Layers, Award, Sparkles, Filter, X } from 'lucide-react';

interface CourseItem {
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

interface Props {
  initialCourses: CourseItem[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Tracks' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Databases' },
  { id: 'devops', label: 'DevOps & Git' },
];

export function CoursesClient({ initialCourses }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      // Category filtering
      if (selectedCategory === 'frontend') {
        if (!['html', 'css', 'javascript', 'react', 'typescript'].includes(course.slug)) {
          return false;
        }
      } else if (selectedCategory === 'backend') {
        if (!['python'].includes(course.slug)) {
          return false;
        }
      } else if (selectedCategory === 'database') {
        if (!['sql'].includes(course.slug)) {
          return false;
        }
      } else if (selectedCategory === 'devops') {
        if (!['git'].includes(course.slug)) {
          return false;
        }
      }

      // Search query filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = course.name.toLowerCase().includes(query);
        const matchesDesc = course.description.toLowerCase().includes(query);
        const matchesTopics = course.topics.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTopics;
      }

      return true;
    });
  }, [initialCourses, selectedCategory, searchQuery]);

  const totalQuestions = useMemo(() => {
    return initialCourses.reduce((sum, c) => sum + (c.questionCount || 50), 0);
  }, [initialCourses]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, topics (e.g. React, SQL, Flexbox)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          Showing <strong className="text-white font-bold">{filteredCourses.length}</strong> of{' '}
          <strong className="text-cyan-400">{initialCourses.length}</strong> available tracks
        </span>
        <span className="hidden sm:inline text-slate-500 font-mono">
          Total Question Bank: ~{totalQuestions} questions
        </span>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-200 mb-1">No matching tracks found</h3>
          <p className="text-sm text-slate-400 mb-4">
            Try adjusting your search query or switching back to &ldquo;All Tracks&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
