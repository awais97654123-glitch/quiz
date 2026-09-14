'use client';

/**
 * Web Audio API Sound Synthesizer for CodeQuiz
 * Native browser audio generator: zero network requests, zero broken audio links, 100% reliable.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('codequiz_sound_enabled');
  return saved === null ? true : saved === 'true';
}

export function isBgmEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('codequiz_bgm_enabled');
  return saved === null ? true : saved === 'true';
}

export function isSfxEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('codequiz_sfx_enabled');
  return saved === null ? true : saved === 'true';
}

export function getSoundVolume(): number {
  if (typeof window === 'undefined') return 0.7;
  const saved = localStorage.getItem('codequiz_sound_volume');
  return saved ? Math.max(0.1, Math.min(1.0, parseFloat(saved))) : 0.7;
}

let bgmAudio: HTMLAudioElement | null = null;

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('codequiz_sound_enabled', String(enabled));
  if (!enabled) {
    if (bgmAudio) {
      bgmAudio.pause();
    }
  } else {
    if (isBgmEnabled() && bgmAudio && bgmAudio.currentTime > 0 && !bgmAudio.ended) {
      bgmAudio.play().catch(() => {});
    }
  }
}

export function setBgmEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('codequiz_bgm_enabled', String(enabled));
  if (!enabled) {
    stopQuizBgm();
  } else if (isSoundEnabled()) {
    playQuizBgm();
  }
}

export function setSfxEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('codequiz_sfx_enabled', String(enabled));
}

export function setSoundVolume(vol: number): void {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(0.1, Math.min(1.0, vol));
  localStorage.setItem('codequiz_sound_volume', clamped.toFixed(2));
  if (bgmAudio) {
    bgmAudio.volume = clamped * 0.4;
  }
}

/**
 * Quiz Background Music: "Accept The Challenge" by MaxKoMusic
 * Automatically plays in loop during Quiz & Challenge Modes
 */
export function playQuizBgm(): void {
  if (typeof window === 'undefined') return;
  if (!isSoundEnabled() || !isBgmEnabled()) return;

  try {
    const vol = getSoundVolume() * 0.4;
    if (!bgmAudio) {
      bgmAudio = new Audio('/audio/quiz-bgm.mp3');
      bgmAudio.loop = true;
      bgmAudio.volume = vol;
      bgmAudio.onerror = () => {
        // Fallback to direct external URL if local file is unavailable
        if (bgmAudio && !bgmAudio.src.includes('Accept-The-Challenge')) {
          bgmAudio.src = 'https://www.chosic.com/wp-content/uploads/2024/07/Accept-The-Challenge-chosic.com_.mp3';
          bgmAudio.play().catch(() => {});
        }
      };
    }

    bgmAudio.volume = vol;
    const promise = bgmAudio.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Handle browser autoplay policy: start on user's first click or touch
        const startOnUserAction = () => {
          if (isSoundEnabled() && bgmAudio) {
            bgmAudio.play().catch(() => {});
          }
          window.removeEventListener('click', startOnUserAction);
          window.removeEventListener('keydown', startOnUserAction);
          window.removeEventListener('touchstart', startOnUserAction);
        };
        window.addEventListener('click', startOnUserAction, { once: true });
        window.addEventListener('keydown', startOnUserAction, { once: true });
        window.addEventListener('touchstart', startOnUserAction, { once: true });
      });
    }
  } catch {}
}

export function stopQuizBgm(): void {
  if (typeof window === 'undefined') return;
  try {
    if (bgmAudio) {
      // Smooth fade out
      let vol = bgmAudio.volume;
      const fadeInterval = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          if (bgmAudio) bgmAudio.volume = Math.max(0, vol);
        } else {
          clearInterval(fadeInterval);
          if (bgmAudio) {
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
          }
        }
      }, 40);
    }
  } catch {}
}


/**
 * Countdown Beep (3, 2, 1)
 */
export function playCountdownTick(count: number): void {
  if (!isSoundEnabled() || !isSfxEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const vol = getSoundVolume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freq = count === 1 ? 660 : count === 2 ? 550 : 440;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

/**
 * Countdown GO! Fanfare
 */
export function playCountdownGo(): void {
  if (!isSoundEnabled() || !isSfxEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const vol = getSoundVolume();
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0.25 * vol, ctx.currentTime + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.04);
      osc.stop(ctx.currentTime + 0.6);
    });
  } catch {}
}

/**
 * Option Click / Selection
 */
export function playSelect(): void {
  if (!isSoundEnabled() || !isSfxEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const vol = getSoundVolume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12 * vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {}
}

/**
 * Correct Answer Chime
 */
export function playCorrect(): void {
  if (!isSoundEnabled() || !isSfxEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const vol = getSoundVolume();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.35);
    });
  } catch {}
}

/**
 * Incorrect Answer Tone
 */
export function playIncorrect(): void {
  if (!isSoundEnabled() || !isSfxEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const vol = getSoundVolume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.15 * vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch {}
}

/**
 * Quiz Victory Fanfare
 */
export function playVictory(): void {
  if (!isSoundEnabled() || !isSfxEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const vol = getSoundVolume();
    const chords = [
      { freqs: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },
      { freqs: [587.33, 698.46, 880.0], time: 0.22, dur: 0.2 },
      { freqs: [659.25, 783.99, 987.77], time: 0.44, dur: 0.2 },
      { freqs: [523.25, 659.25, 783.99, 1046.5], time: 0.68, dur: 0.7 },
    ];

    chords.forEach((chord) => {
      chord.freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + chord.time);

        gain.gain.setValueAtTime(0.18 * vol, ctx.currentTime + chord.time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + chord.time + chord.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + chord.time);
        osc.stop(ctx.currentTime + chord.time + chord.dur);
      });
    });
  } catch {}
}
