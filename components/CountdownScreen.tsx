'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';

export function CountdownScreen({ redirectUrl }: { redirectUrl: string }) {
  const router = useRouter();
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState<'counting' | 'go' | 'done'>('counting');

  useEffect(() => {
    if (phase === 'done') {
      router.push(redirectUrl);
      return;
    }

    if (phase === 'go') {
      const timer = setTimeout(() => setPhase('done'), 800);
      return () => clearTimeout(timer);
    }

    if (count > 0) {
      const timer = setTimeout(() => {
        if (count === 1) {
          setPhase('go');
        } else {
          setCount((c) => c - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, phase, redirectUrl, router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080c14]">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Get Ready!</span>
          </div>
          <p className="text-sm text-slate-500">Your quiz is about to begin</p>
        </div>

        {/* Countdown Number */}
        {phase === 'counting' && count > 0 && (
          <div key={count} className="animate-countdown">
            <span className="text-[120px] sm:text-[160px] font-black text-white tabular-nums leading-none drop-shadow-2xl">
              {count}
            </span>
          </div>
        )}

        {/* GO! */}
        {phase === 'go' && (
          <div className="animate-scale-in">
            <span className="text-[80px] sm:text-[100px] font-black bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent leading-none">
              START!
            </span>
          </div>
        )}

        {/* Loading state */}
        {phase === 'done' && (
          <div className="animate-fade-in flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Loading quiz...</span>
          </div>
        )}
      </div>
    </div>
  );
}
