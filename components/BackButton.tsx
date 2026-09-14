'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackUrl?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  fallbackUrl = '/',
  label = 'Back',
  className = '',
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <div className={`flex items-center justify-start ${className}`}>
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all text-xs font-semibold shadow-md backdrop-blur-xl hover:shadow-cyan-500/15 cursor-pointer group"
        aria-label={label}
        title="Go back to previous page or session"
      >
        <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span>{label}</span>
      </button>
    </div>
  );
}
