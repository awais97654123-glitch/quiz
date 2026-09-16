'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hash, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { validateRoomCode } from '@/app/actions/quiz';

interface Props {
  size?: 'sm' | 'lg';
  className?: string;
}

export function RoomCodeInput({ size = 'lg', className = '' }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const isLg = size === 'lg';
  const isComplete = code.length === 6;

  // Accept ONLY numeric characters, maximum 6 digits
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    if (error) setError(null);
    if (isSuccess) setIsSuccess(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit room code.');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const res = await validateRoomCode(code);

      if (!res.success) {
        if (res.requireAuth) {
          router.push(`/login?redirect_url=/room/${code}`);
          return;
        }
        setError(res.error || 'Quiz room not found or has concluded.');
        setIsValidating(false);
        return;
      }

      setIsSuccess(true);
      // Seamless direct transition to the room
      setTimeout(() => {
        router.push(`/room/${code}`);
      }, 250);
    } catch {
      setError('Network error validating room code. Please try again.');
      setIsValidating(false);
    }
  };

  return (
    <form onSubmit={handleJoin} className={`w-full max-w-md ${className}`}>
      <div
        className={`relative flex items-center rounded-full bg-slate-900/90 border transition-all duration-300 backdrop-blur-2xl ${
          error
            ? 'border-rose-500/80 shadow-lg shadow-rose-500/10'
            : isSuccess
            ? 'border-emerald-400 shadow-xl shadow-emerald-500/20'
            : isComplete
            ? 'border-[#00d9ff] shadow-xl shadow-[#00d9ff]/25 ring-2 ring-[#00d9ff]/20'
            : 'border-white/10 hover:border-cyan-500/40 focus-within:border-[#00d9ff] focus-within:ring-2 focus-within:ring-[#00d9ff]/20 shadow-xl'
        } ${isLg ? 'p-1.5 sm:p-2 pl-3.5 sm:pl-4' : 'p-1 pl-3'}`}
      >
        {/* Left Hash Symbol */}
        <div
          className={`flex items-center justify-center rounded-full transition-colors ${
            isSuccess
              ? 'bg-emerald-500/20 text-emerald-400'
              : isComplete
              ? 'bg-cyan-500/20 text-[#00d9ff]'
              : 'bg-white/5 text-slate-400'
          } ${isLg ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-7 h-7'} shrink-0`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Hash className={isLg ? 'w-4 h-4 text-slate-300' : 'w-3.5 h-3.5'} />
          )}
        </div>

        {/* 6-Digit Numeric Input */}
        <div className="relative flex-1 px-2.5 sm:px-3 min-w-0">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter 6-digit room code"
            value={code}
            onChange={handleChange}
            maxLength={6}
            disabled={isValidating || isSuccess}
            className={`w-full bg-transparent text-white font-mono placeholder:font-sans placeholder:text-slate-500 focus:outline-none transition-all ${
              code ? 'tracking-[0.18em] sm:tracking-[0.25em] font-extrabold text-base sm:text-lg' : 'tracking-normal font-normal text-xs sm:text-sm'
            }`}
          />
        </div>

        {/* Live Digits Counter */}
        {code.length > 0 && code.length < 6 && (
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 mr-2 shrink-0">
            {code.length}/6
          </span>
        )}

        {/* Join Room CTA Button (Unified Cyan Accent) */}
        <button
          type="submit"
          disabled={!isComplete || isValidating || isSuccess}
          className={`shrink-0 rounded-full font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isSuccess
              ? 'bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-400/30'
              : isComplete
              ? 'bg-[#00d9ff] hover:bg-[#38eeff] text-slate-950 font-black shadow-lg shadow-cyan-400/35 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-white/10 text-slate-300 hover:bg-white/15'
          } ${isLg ? 'px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm' : 'px-3 py-1.5 text-xs'}`}
        >
          {isValidating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Joining...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Connecting</span>
            </>
          ) : (
            <>
              <span>Join Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Error Feedback Message */}
      {error && (
        <div className="flex items-center gap-2 mt-2.5 text-rose-400 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-150 pl-3">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
