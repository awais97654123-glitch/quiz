import { getSoloResult } from '@/app/actions/quiz';
import { QuizResultView } from '@/components/QuizResultView';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ attemptId: string }>;
}

export const metadata: Metadata = {
  title: 'Quiz Results | CodeQuiz',
};

export default async function ResultPage({ params }: Props) {
  const { attemptId } = await params;
  const result = await getSoloResult(attemptId);

  if (!result) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-24 text-center">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Result Not Found</h2>
          <p className="text-xs text-slate-400">This quiz result doesn&apos;t exist or may have been removed.</p>
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
      <QuizResultView result={result} />
    </div>
  );
}
