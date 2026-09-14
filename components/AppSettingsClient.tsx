'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Zap,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Sparkles,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Shield,
  Smartphone,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import {
  isSoundEnabled,
  setSoundEnabled,
  isBgmEnabled,
  setBgmEnabled,
  isSfxEnabled,
  setSfxEnabled,
  getSoundVolume,
  setSoundVolume,
  playCorrect,
  playVictory,
} from '@/lib/sound';
import { ProfileSignOutButton } from './ProfileSignOutButton';

export function AppSettingsClient() {
  // Audio state
  const [masterSound, setMasterSoundState] = useState(true);
  const [bgm, setBgmState] = useState(true);
  const [sfx, setSfxState] = useState(true);
  const [volume, setVolumeState] = useState(70);

  // Gameplay state
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [timerPulse, setTimerPulse] = useState(true);
  const [compactHud, setCompactHud] = useState(false);

  // Notification state
  const [notifChallenges, setNotifChallenges] = useState(true);
  const [notifSound, setNotifSound] = useState(true);
  const [notifLeaderboard, setNotifLeaderboard] = useState(true);

  // Performance & Privacy state
  const [reduceMotion, setReduceMotion] = useState(false);
  const [incognito, setIncognito] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Audio
    setMasterSoundState(isSoundEnabled());
    setBgmState(isBgmEnabled());
    setSfxState(isSfxEnabled());
    setVolumeState(Math.round(getSoundVolume() * 100));

    // Gameplay
    setAutoAdvance(localStorage.getItem('codequiz_auto_advance') !== 'false');
    setInstantFeedback(localStorage.getItem('codequiz_instant_feedback') !== 'false');
    setTimerPulse(localStorage.getItem('codequiz_timer_pulse') !== 'false');
    setCompactHud(localStorage.getItem('codequiz_compact_hud') === 'true');

    // Notifications
    setNotifChallenges(localStorage.getItem('codequiz_notif_challenges') !== 'false');
    setNotifSound(localStorage.getItem('codequiz_notif_sound') !== 'false');
    setNotifLeaderboard(localStorage.getItem('codequiz_notif_leaderboard') !== 'false');

    // Display
    setReduceMotion(localStorage.getItem('codequiz_reduce_motion') === 'true');
    setIncognito(localStorage.getItem('codequiz_incognito') === 'true');
  }, []);

  // Handlers for Audio
  const handleToggleMasterSound = (val: boolean) => {
    setMasterSoundState(val);
    setSoundEnabled(val);
    showToast(val ? 'Master audio enabled' : 'Master audio muted');
  };

  const handleToggleBgm = (val: boolean) => {
    setBgmState(val);
    setBgmEnabled(val);
    showToast(val ? 'Quiz background music enabled' : 'Quiz background music muted');
  };

  const handleToggleSfx = (val: boolean) => {
    setSfxState(val);
    setSfxEnabled(val);
    showToast(val ? 'Sound effects enabled' : 'Sound effects muted');
  };

  const handleVolumeChange = (newVal: number) => {
    setVolumeState(newVal);
    setSoundVolume(newVal / 100);
  };

  const handleTestChime = () => {
    if (!masterSound || !sfx) {
      showToast('Sound effects are currently muted. Enable SFX to hear chime.');
      return;
    }
    playCorrect();
    showToast('♪ Playing test audio chime!');
  };

  // Handlers for Gameplay
  const handleToggleAutoAdvance = (val: boolean) => {
    setAutoAdvance(val);
    localStorage.setItem('codequiz_auto_advance', String(val));
    showToast(val ? 'Auto-advance enabled' : 'Auto-advance disabled (manual next)');
  };

  const handleToggleInstantFeedback = (val: boolean) => {
    setInstantFeedback(val);
    localStorage.setItem('codequiz_instant_feedback', String(val));
    showToast(val ? 'Instant answer feedback enabled' : 'Instant feedback disabled');
  };

  const handleToggleTimerPulse = (val: boolean) => {
    setTimerPulse(val);
    localStorage.setItem('codequiz_timer_pulse', String(val));
    showToast(val ? '5-Second warning pulse enabled' : '5-Second warning pulse disabled');
  };

  const handleToggleCompactHud = (val: boolean) => {
    setCompactHud(val);
    localStorage.setItem('codequiz_compact_hud', String(val));
    showToast(val ? 'Compact mobile HUD enabled' : 'Standard HUD enabled');
  };

  // Handlers for Notifications
  const handleToggleNotifChallenges = (val: boolean) => {
    setNotifChallenges(val);
    localStorage.setItem('codequiz_notif_challenges', String(val));
    showToast(val ? '1v1 Challenge invite alerts enabled' : '1v1 Challenge invites silenced');
  };

  const handleToggleNotifSound = (val: boolean) => {
    setNotifSound(val);
    localStorage.setItem('codequiz_notif_sound', String(val));
    showToast(val ? 'Notification chime sound enabled' : 'Notification chime muted');
  };

  const handleToggleNotifLeaderboard = (val: boolean) => {
    setNotifLeaderboard(val);
    localStorage.setItem('codequiz_notif_leaderboard', String(val));
    showToast(val ? 'Leaderboard milestone notifications active' : 'Milestone notifications disabled');
  };

  // Handlers for Display & Privacy
  const handleToggleReduceMotion = (val: boolean) => {
    setReduceMotion(val);
    localStorage.setItem('codequiz_reduce_motion', String(val));
    showToast(val ? 'Reduced motion / High-speed performance active' : 'Standard fluid animations restored');
  };

  const handleToggleIncognito = (val: boolean) => {
    setIncognito(val);
    localStorage.setItem('codequiz_incognito', String(val));
    showToast(val ? 'Incognito leaderboard mode active' : 'Public profile visible on leaderboard');
  };

  // Handlers for Cache & Reset
  const handleClearLocalCache = () => {
    if (typeof window === 'undefined') return;
    try {
      // Clear quiz drafts and cached attempts without removing auth tokens
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('quiz_') || key.startsWith('draft_') || key.includes('cache'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      showToast('Local quiz cache cleared successfully!');
    } catch {
      showToast('Cache cleared.');
    }
  };

  const handleResetToDefaults = () => {
    handleToggleMasterSound(true);
    handleToggleBgm(true);
    handleToggleSfx(true);
    handleVolumeChange(70);
    handleToggleAutoAdvance(true);
    handleToggleInstantFeedback(true);
    handleToggleTimerPulse(true);
    handleToggleCompactHud(false);
    handleToggleNotifChallenges(true);
    handleToggleNotifSound(true);
    handleToggleNotifLeaderboard(true);
    handleToggleReduceMotion(false);
    handleToggleIncognito(false);
    showToast('All application settings reset to factory defaults!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999999] px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl flex items-center gap-3 text-white text-xs sm:text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Audio & Arena Ambience Settings */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Audio &amp; Quiz Ambience</h3>
              <p className="text-xs text-slate-400">Control synthesizer audio, background music, and sound effects.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestChime}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Test Chime</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Master Audio */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Master Sound</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${masterSound ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  {masterSound ? 'ENABLED' : 'MUTED'}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Global master switch for all audio playback across the entire app.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleMasterSound(!masterSound)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${masterSound ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${masterSound ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Quiz Background Music */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-cyan-400" />
                <span>Quiz Background Music (BGM)</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Looping focus music during solo quizzes, 1v1 duels, and live multiplayer matches.
              </div>
            </div>

            <button
              type="button"
              disabled={!masterSound}
              onClick={() => handleToggleBgm(!bgm)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-40 ${bgm && masterSound ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${bgm && masterSound ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Sound Effects SFX */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Interactive Sound Effects (SFX)</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Web Audio synthesizer feedback for option clicks, correct answers, and victory fanfare.
              </div>
            </div>

            <button
              type="button"
              disabled={!masterSound}
              onClick={() => handleToggleSfx(!sfx)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-40 ${sfx && masterSound ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sfx && masterSound ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Master Volume Level</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">{volume}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={volume}
              disabled={!masterSound}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* 2. Quiz Experience & Gameplay Settings */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Quiz Experience &amp; Auto-Advance</h3>
            <p className="text-xs text-slate-400">Tailor the answering pace, instant feedback, and visual indicators.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Auto Advance */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Auto-Advance on Option Selection</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Automatically slide to next question 0.8s after clicking an answer for high-velocity practice.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleAutoAdvance(!autoAdvance)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${autoAdvance ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoAdvance ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Instant Feedback */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Instant Answer Highlight</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Immediately illuminate selected option with correct (emerald) or wrong (rose) indicators.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleInstantFeedback(!instantFeedback)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${instantFeedback ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${instantFeedback ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* 5-Second Warning Pulse */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">5-Second Countdown Warning Pulse</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Vibrant warning pulse and audible alert when question timer drops below 5 seconds.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleTimerPulse(!timerPulse)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${timerPulse ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${timerPulse ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Compact Mobile HUD */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Compact Mobile HUD</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Minimize question header padding to provide more screen space for question text on phones.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleCompactHud(!compactHud)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${compactHud ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${compactHud ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notification & Duel Alerts Settings */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Notifications &amp; Duel Invites</h3>
            <p className="text-xs text-slate-400">Configure real-time 1v1 challenge alerts and milestone notifications.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Challenge Popups */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">1v1 Friend Duel Challenge Popups</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Display instant full-screen challenge invitation when challenged by another coder.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleNotifChallenges(!notifChallenges)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${notifChallenges ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifChallenges ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Audio Chime on Alert */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Notification Audio Chime</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Play an audible ringtone when a friend challenges you or accepts your match.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleNotifSound(!notifSound)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${notifSound ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifSound ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Leaderboard Milestones */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Leaderboard Milestone Alerts</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Congratulatory notifications when you reach Diamond or Top 10 International ranking.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleNotifLeaderboard(!notifLeaderboard)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${notifLeaderboard ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifLeaderboard ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Performance & Privacy */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Performance &amp; Privacy</h3>
            <p className="text-xs text-slate-400">Boost framerates on low-end hardware and manage leaderboard privacy.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Reduce Motion */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Reduce Motion / High-Speed Mode</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Disable heavy background blur filters and radial particles for silky smooth 60fps on older phones.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleReduceMotion(!reduceMotion)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${reduceMotion ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Incognito Leaderboard */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {incognito ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                <span>Incognito Leaderboard Display</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Display as &quot;Anonymous Coder&quot; on public leaderboards while keeping your personal MMR synced.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleIncognito(!incognito)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${incognito ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${incognito ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Storage & System Controls */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Storage &amp; Session Management</h3>
            <p className="text-xs text-slate-400">Clear temporary local data or reset preferences back to default.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-sm font-bold text-white">Clear Local Quiz Cache</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Purge saved question drafts and temporary local states while preserving your login session.
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearLocalCache}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 self-start"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Cache</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-sm font-bold text-white">Reset All Settings</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Revert all audio, gameplay, and notification toggles back to original factory defaults.
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 self-start"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white">Sign Out of Session</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Securely disconnect this device from your CodeQuiz developer profile.
            </div>
          </div>
          <ProfileSignOutButton />
        </div>
      </div>
    </div>
  );
}
