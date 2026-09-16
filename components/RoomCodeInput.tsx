'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hash, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export function RoomCodeInput({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCode(val);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 8) {
      setError('Please enter a valid 8-digit room code');
      return;
    }
    router.push(`/room/${code}`);
  };

  const isLg = size === 'lg';
  const isComplete = code.length === 8;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative flex items-center rounded-full bg-white/90 border transition-all duration-300 backdrop-blur-2xl ${
          error
            ? 'border-rose-400 shadow-lg shadow-rose-500/10'
            : isComplete
            ? 'border-cyan-500 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/25'
            : 'border-slate-200 hover:border-cyan-400/70 shadow-lg shadow-slate-900/5 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/15'
        } ${isLg ? 'p-1.5 sm:p-2 pl-3 sm:pl-4' : 'p-1 pl-2.5'}`}
      >
        {/* Left Symbol / Icon */}
        <div
          className={`flex items-center justify-center rounded-xl transition-colors ${
            isComplete
              ? 'bg-cyan-100 text-cyan-600'
              : 'bg-slate-100 text-slate-500'
          } ${isLg ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} shrink-0`}
        >
          {isComplete ? (
            <Sparkles className={isLg ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 animate-pulse' : 'w-3 h-3 sm:w-3.5 sm:h-3.5'} />
          ) : (
            <Hash className={isLg ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-3 h-3 sm:w-3.5 sm:h-3.5'} />
          )}
        </div>

        {/* 8-Digit Input */}
        <div className="relative flex-1 px-2 sm:px-3 min-w-0">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="8-digit Room Code"
            value={code}
            onChange={handleChange}
            maxLength={8}
            className={`w-full bg-transparent text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400 focus:outline-none transition-all ${
              code ? 'tracking-[0.12em] sm:tracking-[0.25em] font-extrabold' : 'tracking-normal font-normal'
            } ${isLg ? 'text-xs sm:text-base' : 'text-xs sm:text-sm'}`}
          />
        </div>

        {/* Live Counter Badge */}
        {code.length > 0 && code.length < 8 && (
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 mr-1 sm:mr-2 shrink-0">
            {code.length}/8
          </span>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          className={`shrink-0 rounded-full font-extrabold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
            isComplete
              ? 'bg-[#00e5ff] hover:bg-[#38eeff] text-slate-950 shadow-lg shadow-cyan-400/40 scale-[1.02]'
              : 'bg-[#00e5ff] hover:bg-[#38eeff] text-slate-950 shadow-md shadow-cyan-500/25'
          } ${isLg ? 'px-3.5 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm' : 'px-3 sm:px-4 py-1.5 text-xs'}`}
        >
          <span className="hidden min-[380px]:inline">Join Room</span>
          <span className="min-[380px]:hidden">Join</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-start gap-1.5 mt-2 text-rose-400 text-xs font-semibold animate-fade-in pl-3">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
