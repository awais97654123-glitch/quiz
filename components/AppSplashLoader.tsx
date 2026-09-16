'use client';

import { useEffect, useState } from 'react';
import { BrandMark } from '@/components/BrandMark';

export function AppSplashLoader() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      const hasLoaded = sessionStorage.getItem('cq_splash_loaded');
      if (hasLoaded) return;
    } catch {
      return;
    }

    setVisible(true);

    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('cq_splash_loaded', 'true');
      } catch {}
    }, 2050);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#eef2f9] bg-grid-pattern transition-opacity duration-500 select-none cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient light mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/3 w-[360px] h-[360px] bg-violet-400/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-7">
        {/* Rotating accent ring around the animated logo */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-28 h-28 rounded-full border-2 border-transparent border-t-cyan-500 border-r-violet-500"
            style={{ animation: 'brand-ring-spin 1.1s linear infinite' }}
          />
          <div
            className="absolute w-20 h-20 rounded-full border-2 border-transparent border-b-sky-400"
            style={{ animation: 'brand-ring-spin 1.6s linear infinite reverse' }}
          />
          <div className="relative z-10 drop-shadow-[0_10px_30px_rgba(8,145,178,0.35)]">
            <BrandMark size={72} animated />
          </div>
        </div>

        {/* Animated wordmark */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-baseline text-2xl font-black tracking-tight">
            <span className="boarding-word text-slate-900" style={{ animationDelay: '0.35s' }}>
              Code
            </span>
            <span
              className="boarding-word bg-gradient-to-r from-cyan-600 via-sky-500 to-violet-600 bg-clip-text text-transparent"
              style={{ animationDelay: '0.5s' }}
            >
              Quiz
            </span>
          </div>
          <p
            className="boarding-word text-[11px] font-mono uppercase tracking-[0.28em] text-slate-500"
            style={{ animationDelay: '0.7s' }}
          >
            Loading arena
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-44 h-1 rounded-full bg-slate-200 overflow-hidden">
          <div className="boarding-bar h-full w-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500" />
        </div>
      </div>
    </div>
  );
}
