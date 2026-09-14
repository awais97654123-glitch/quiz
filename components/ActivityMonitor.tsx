'use client';

import { useEffect, useState, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  roomCode: string;
}

export function ActivityMonitor({ roomCode }: Props) {
  const [warning, setWarning] = useState<string | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function showWarning(msg: string) {
      setWarning(msg);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = setTimeout(() => {
        setWarning(null);
      }, 4000);
    }

    async function sendEvent(eventType: string, metadata?: string) {
      try {
        await fetch(`/api/room/${roomCode}/activity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType, metadata }),
        });
      } catch (e) {
        console.error('Failed to report activity event:', e);
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        sendEvent('TAB_SWITCH', 'Switched away from quiz tab');
        showWarning('Warning: Tab switch recorded! Proctor notified.');
      } else {
        sendEvent('TAB_RETURN', 'Returned to quiz tab');
      }
    }

    function handleWindowBlur() {
      sendEvent('FOCUS_LOST', 'Window lost focus / clicked outside');
      showWarning('Warning: Focus lost! Please stay focused on the quiz.');
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        sendEvent('FULLSCREEN_EXIT', 'Exited fullscreen mode');
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [roomCode]);

  if (!warning) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 animate-bounce">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs font-semibold shadow-xl backdrop-blur-md">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        <span>{warning}</span>
      </div>
    </div>
  );
}
