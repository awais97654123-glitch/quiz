'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  User as UserIcon,
  AtSign,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { initiateSignUp, verifySignUpOtp, resendVerificationOtp } from '@/app/actions/auth';

interface Props {
  redirectUrl?: string;
}

export function SupabaseSignUpForm({ redirectUrl }: Props) {
  const router = useRouter();

  // Step 1: Details, Step 2: OTP Verification
  const [step, setStep] = useState<'details' | 'otp'>('details');

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const destination = redirectUrl || '/courses';

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Step 1: Submit Details -> Trigger Real OTP
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await initiateSignUp({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });

      if (!res.success) {
        setError(res.error || 'Failed to initiate registration.');
        setIsLoading(false);
        return;
      }

      setStep('otp');
      setResendCooldown(45);
      if (res.devOtpCode) {
        setDevOtp(res.devOtpCode);
      }
      setInfoMessage(res.message || `A 6-digit code has been dispatched to ${email.trim()}.`);
      setIsLoading(false);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during account creation.';
      setError(message);
      setIsLoading(false);
    }
  };

  // Step 2: Submit OTP Code -> Create Account & Establish Session
  const handleOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await verifySignUpOtp({
        email: email.trim(),
        code: fullCode,
      });

      if (!res.success) {
        setError(res.error || 'Incorrect code. Please try again.');
        setIsLoading(false);
        return;
      }

      window.dispatchEvent(new Event('cq-auth-change'));
      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during verification.';
      setError(message);
      setIsLoading(false);
    }
  };

  // Handle individual digit inputs
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto submit on 6th digit entered
    if (digit && index === 5 && newDigits.every((d) => d.length === 1)) {
      setTimeout(() => {
        handleOtpSubmit();
      }, 50);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();

    if (pasted.length === 6) {
      setTimeout(() => handleOtpSubmit(), 100);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    try {
      const res = await resendVerificationOtp({
        email: email.trim(),
        type: 'SIGNUP',
      });

      if (!res.success) {
        setError(res.error || 'Failed to resend code.');
        setIsResending(false);
        return;
      }

      setResendCooldown(45);
      if (res.devOtpCode) {
        setDevOtp(res.devOtpCode);
      }
      setInfoMessage(`A fresh 6-digit code has been prepared for ${email.trim()}.`);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch {
      setError('Could not resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
      {/* Radiant Glow Edge */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Step Indicator Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'details'
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-emerald-500 text-slate-950'
            }`}
          >
            {step === 'otp' ? '✓' : '1'}
          </div>
          <span className="text-xs font-bold text-white">Account Details</span>
        </div>

        <div className="w-8 h-px bg-white/10" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'otp'
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 border border-white/10'
            }`}
          >
            2
          </div>
          <span className={`text-xs font-bold ${step === 'otp' ? 'text-white' : 'text-slate-500'}`}>
            Email Verification
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Info Message */}
      {infoMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-start gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
          <span className="leading-relaxed">{infoMessage}</span>
        </div>
      )}

      {/* Developer Test Mode OTP Quick Access */}
      {devOtp && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-1.5 animate-scale-in">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Developer Test Mode • Auto-Generated Code</span>
          </div>
          <div className="text-xs font-mono font-black text-amber-100 tracking-widest bg-amber-950/40 p-2 rounded-lg border border-amber-500/20 text-center">
            {devOtp}
          </div>
        </div>
      )}

      {/* STEP 1: REGISTRATION DETAILS FORM */}
      {step === 'details' ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username <span className="text-slate-500 font-normal lowercase">(for 1v1 duels)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="adalovelace"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@codequiz.dev"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password <span className="text-slate-500 font-normal">(min 6 chars)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Code...</span>
              </>
            ) : (
              <>
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* STEP 2: 6-DIGIT OTP VERIFICATION */
        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <div className="text-center space-y-1">
            <span className="text-xs text-slate-400">Enter the 6-digit verification code sent to</span>
            <div className="text-sm font-bold text-cyan-300 font-mono">{email}</div>
          </div>

          {/* 6 Individual Digit Inputs with Auto-Advance & Paste */}
          <div className="flex justify-between gap-2 sm:gap-2.5 max-w-sm mx-auto" onPaste={handleOtpPaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpInputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="w-11 sm:w-12 h-13 sm:h-14 text-center font-mono font-black text-xl sm:text-2xl text-white bg-slate-950/80 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 shadow-inner transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otpDigits.some((d) => !d)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activating Account...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify &amp; Create Account</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setError(null);
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Edit Details
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isResending}
              className="text-cyan-400 hover:text-cyan-300 font-semibold disabled:text-slate-600 transition-colors"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link
          href={`/login${redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
        >
          Sign In Here →
        </Link>
      </div>
    </div>
  );
}
