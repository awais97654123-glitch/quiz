'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

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

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 400);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('cq_splash_loaded', 'true');
      } catch {}
    }, 700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed inset-0 z-[99999] bg-[#080c14] flex flex-col items-center justify-center transition-opacity duration-300 select-none cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Glowing Background Radial */}
        <div className="absolute -top-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Animated Brand Icon */}
        <div className="relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 animate-bounce">
          <Zap className="w-10 h-10 text-white" />
        </div>

        {/* Sleek Dual-Ring Circular Loader */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-2 border-slate-800/80 border-t-cyan-400 border-r-indigo-500 animate-spin" />
          <div className="absolute w-8 h-8 rounded-full border-2 border-transparent border-b-cyan-300 animate-[spin_1.5s_linear_infinite_reverse]" />
        </div>
      </div>
    </div>
  );
}
