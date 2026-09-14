import { getSoloQuestions } from '@/app/actions/quiz';
import { QuizSession } from '@/components/QuizSession';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ count?: string; difficulty?: string }>;
}

export const metadata: Metadata = {
  title: 'Quiz | CodeQuiz',
};

export default async function QuizPlayPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const count = parseInt(sp.count || '10', 10);
  const difficulty = sp.difficulty || 'ALL';

  let data = null;
  let loadFailed = false;

  try {
    data = await getSoloQuestions(slug, count, difficulty);
  } catch (error) {
    console.error(`Error loading quiz for slug "${slug}":`, error);
    loadFailed = true;
  }

  if (loadFailed || !data) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-24 text-center">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Quiz Not Available</h2>
          <p className="text-xs text-slate-400">
            Couldn&apos;t load questions for &ldquo;{slug}&rdquo;. The course may not have enough questions for your selected count.
          </p>
          <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <QuizSession
        questions={data.questions}
        courseName={data.courseName}
        courseSlug={data.courseSlug}
        courseId={data.courseId}
        quizName={`${data.courseName} Quiz`}
      />
    </div>
  );
}
