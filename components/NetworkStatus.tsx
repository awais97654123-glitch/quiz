'use client';

import { useState, useEffect } from 'react';
import { WifiOff, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

export function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => {
      setIsOffline(true);
      setIsSlow(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setIsSlow(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 3000);
    };

    // Check initial online status
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    // Check Network Information API if supported
    const nav = navigator as unknown as {
      connection?: {
        effectiveType?: string;
        saveData?: boolean;
        addEventListener?: (event: string, cb: () => void) => void;
        removeEventListener?: (event: string, cb: () => void) => void;
      };
    };

    const checkConnectionSpeed = () => {
      if (nav.connection) {
        const is2g = nav.connection.effectiveType === '2g' || nav.connection.effectiveType === 'slow-2g';
        setIsSlow(is2g);
      }
    };

    checkConnectionSpeed();

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = reason?.message || String(reason || '');
      const stack = reason?.stack || '';

      // Intercept chrome-extension injected errors or failed extension background fetches
      if (
        msg.includes('Failed to fetch') ||
        stack.includes('chrome-extension://') ||
        msg.includes('Extension context invalidated')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    if (nav.connection?.addEventListener) {
      nav.connection.addEventListener('change', checkConnectionSpeed);
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      if (nav.connection?.removeEventListener) {
        nav.connection.removeEventListener('change', checkConnectionSpeed);
      }
    };
  }, []);

  const handleManualRetry = async () => {
    setIsRetrying(true);
    if (!navigator.onLine) {
      setIsOffline(true);
    } else {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          setIsOffline(false);
          setIsSlow(false);
          setJustReconnected(true);
          setTimeout(() => setJustReconnected(false), 3000);
        }
      } catch {
        setIsOffline(!navigator.onLine);
      }
    }
    setTimeout(() => setIsRetrying(false), 600);
  };

  if (!isOffline && !isSlow && !justReconnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up pointer-events-auto">
      {isOffline ? (
        <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/40 text-rose-200 backdrop-blur-xl shadow-2xl shadow-rose-950/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <WifiOff className="w-5 h-5 text-rose-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Connection Lost
              </div>
              <p className="text-xs text-rose-300 truncate">
                You are offline. Please check your network connection.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualRetry}
            disabled={isRetrying}
            className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Testing...' : 'Retry'}</span>
          </button>
        </div>
      ) : isSlow ? (
        <div className="p-3.5 rounded-2xl bg-amber-950/90 border border-amber-500/40 text-amber-200 backdrop-blur-xl shadow-2xl shadow-amber-950/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <div className="text-xs text-amber-300">
              <strong className="text-white font-bold">Slow Network Detected.</strong> Quizzes are optimized to run smoothly.
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualRetry}
            className="text-[11px] font-bold text-amber-300 hover:text-white px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors shrink-0 cursor-pointer"
          >
            Check
          </button>
        </div>
      ) : justReconnected ? (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 backdrop-blur-xl shadow-2xl shadow-emerald-950/50 flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-emerald-300">
            Back online! Connection restored.
          </span>
        </div>
      ) : null}
    </div>
  );
}
