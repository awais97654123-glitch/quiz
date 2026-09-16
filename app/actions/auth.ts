'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import {
  hashPassword,
  verifyPassword,
  generateOtp,
  setSessionCookie,
  getSessionCookie,
  clearSessionCookie,
} from '@/lib/auth/session';
import { sendOtpEmail } from '@/lib/email';

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  username?: string;
  institutionType?: string;
  institutionName?: string;
  codingLevel?: string;
  avatar?: string;
  provider: 'local';
}

/**
 * Get current authenticated user (cached per request lifecycle)
 */
export const getAuthUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const session = await getSessionCookie();
    if (!session || !session.userId) {
      return null;
    }

    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkUserId: session.userId },
          { email: session.email },
        ],
      },
    });

    if (!dbUser) {
      return null;
    }

    return {
      userId: dbUser.clerkUserId,
      name: dbUser.name || dbUser.email?.split('@')[0] || 'Developer',
      email: dbUser.email || session.email,
      username: dbUser.username || undefined,
      institutionType: dbUser.institutionType || undefined,
      institutionName: dbUser.institutionName || undefined,
      codingLevel: dbUser.codingLevel || undefined,
      avatar: dbUser.avatar || undefined,
      provider: 'local',
    };
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err;
    }
    console.error('Error in getAuthUser:', err);
    return null;
  }
});

/**
 * Step 1: Initiate Sign Up (Validate & Send Gmail OTP)
 */
export async function initiateSignUp(params: {
  name?: string;
  email: string;
  password: string;
}) {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.name?.trim() || cleanEmail.split('@')[0];
    const password = params.password;

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    // Generate secure 6-digit OTP & hash password
    const code = generateOtp();
    const hashedPassword = hashPassword(password);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any previous pending OTP for this email
    await prisma.emailVerificationOtp.deleteMany({
      where: { email: cleanEmail, type: 'SIGNUP' },
    });

    // Save pending OTP record
    await prisma.emailVerificationOtp.create({
      data: {
        email: cleanEmail,
        code,
        type: 'SIGNUP',
        metadata: JSON.stringify({
          name: cleanName,
          passwordHash: hashedPassword,
        }),
        expiresAt,
      },
    });

    // Dispatch real email via Resend
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      code,
      type: 'SIGNUP',
      name: cleanName,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: `Could not send verification code to ${cleanEmail}: ${emailResult.error || 'Email delivery failed'}. Check your Resend API configuration.`,
      };
    }

    return {
      success: true,
      email: cleanEmail,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox or spam folder.`,
    };
  } catch (err: any) {
    console.error('Error in initiateSignUp:', err);
    return { success: false, error: err?.message || 'Failed to initiate registration.' };
  }
}

/**
 * Step 2: Verify Sign Up OTP and create the account
 */
export async function verifySignUpOtp(params: {
  email: string;
  code: string;
}) {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanCode = params.code.trim();

    if (!cleanEmail || !cleanCode) {
      return { success: false, error: 'Please provide both your email and the 6-digit verification code.' };
    }

    // Find the latest valid OTP record
    const otpRecord = await prisma.emailVerificationOtp.findFirst({
      where: {
        email: cleanEmail,
        type: 'SIGNUP',
        code: cleanCode,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return { success: false, error: 'Incorrect verification code. Please check your email and try again.' };
    }

    if (new Date() > otpRecord.expiresAt) {
      return { success: false, error: 'This verification code has expired. Please request a new one.' };
    }

    // Parse stored signup metadata
    let metadata: { name?: string; passwordHash?: string } = {};
    if (otpRecord.metadata) {
      try {
        metadata = JSON.parse(otpRecord.metadata);
      } catch {
        // ignore parse error
      }
    }

    // Check if user was registered concurrently
    let user = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (!user) {
      const generatedClerkId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      user = await prisma.user.create({
        data: {
          clerkUserId: generatedClerkId,
          email: cleanEmail,
          name: metadata.name || cleanEmail.split('@')[0],
          passwordHash: metadata.passwordHash || null,
        },
      });
    } else if (metadata.passwordHash) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: metadata.passwordHash,
          name: user.name || metadata.name,
        },
      });
    }

    // Delete used OTPs
    await prisma.emailVerificationOtp.deleteMany({
      where: { email: cleanEmail, type: 'SIGNUP' },
    });

    // Create session cookie
    await setSessionCookie({
      id: user.clerkUserId,
      email: user.email!,
      name: user.name || user.email!.split('@')[0],
      username: user.username,
    });

    return {
      success: true,
      user: {
        userId: user.clerkUserId,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    };
  } catch (err: any) {
    console.error('Error in verifySignUpOtp:', err);
    return { success: false, error: err?.message || 'Failed to complete verification.' };
  }
}

/**
 * Step 1: Initiate Sign In (Verify Password & Send Gmail OTP)
 */
export async function initiateSignIn(params: {
  email: string;
  password: string;
}) {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    const password = params.password;

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const user = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (!user) {
      return {
        success: false,
        error: 'No account found with this email address. Please sign up first.',
      };
    }

    if (!user.passwordHash) {
      return {
        success: false,
        error: 'This account does not have a password set. Please complete sign up or reset your password.',
      };
    }

    const isMatch = verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Generate 6-digit OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any old login OTPs
    await prisma.emailVerificationOtp.deleteMany({
      where: { email: cleanEmail, type: 'LOGIN' },
    });

    // Save login OTP
    await prisma.emailVerificationOtp.create({
      data: {
        email: cleanEmail,
        code,
        type: 'LOGIN',
        expiresAt,
      },
    });

    // Send email via Resend
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      code,
      type: 'LOGIN',
      name: user.name || undefined,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: `Could not send verification code to ${cleanEmail}: ${emailResult.error || 'Email delivery failed'}.`,
      };
    }

    return {
      success: true,
      email: cleanEmail,
      message: `A 6-digit security code has been sent to ${cleanEmail}.`,
    };
  } catch (err: any) {
    console.error('Error in initiateSignIn:', err);
    return { success: false, error: err?.message || 'Failed to sign in.' };
  }
}

/**
 * Step 2: Verify Sign In OTP and establish session
 */
export async function verifySignInOtp(params: {
  email: string;
  code: string;
}) {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanCode = params.code.trim();

    if (!cleanEmail || !cleanCode) {
      return { success: false, error: 'Please enter the 6-digit code sent to your email.' };
    }

    const otpRecord = await prisma.emailVerificationOtp.findFirst({
      where: {
        email: cleanEmail,
        type: 'LOGIN',
        code: cleanCode,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return { success: false, error: 'Incorrect code. Please verify and try again.' };
    }

    if (new Date() > otpRecord.expiresAt) {
      return { success: false, error: 'This verification code has expired. Please request a new one.' };
    }

    const user = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    // Delete used OTP
    await prisma.emailVerificationOtp.deleteMany({
      where: { email: cleanEmail, type: 'LOGIN' },
    });

    // Set session cookie
    await setSessionCookie({
      id: user.clerkUserId,
      email: user.email!,
      name: user.name || user.email!.split('@')[0],
      username: user.username,
    });

    return {
      success: true,
      user: {
        userId: user.clerkUserId,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    };
  } catch (err: any) {
    console.error('Error in verifySignInOtp:', err);
    return { success: false, error: err?.message || 'Failed to verify code.' };
  }
}

/**
 * Resend OTP Code
 */
export async function resendVerificationOtp(params: {
  email: string;
  type: 'SIGNUP' | 'LOGIN';
}) {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Invalid email address.' };
    }

    // Check rate limit: if last OTP was created < 45 seconds ago
    const lastOtp = await prisma.emailVerificationOtp.findFirst({
      where: { email: cleanEmail, type: params.type },
      orderBy: { createdAt: 'desc' },
    });

    if (lastOtp) {
      const elapsedMs = Date.now() - lastOtp.createdAt.getTime();
      if (elapsedMs < 45000) {
        const waitSec = Math.ceil((45000 - elapsedMs) / 1000);
        return {
          success: false,
          error: `Please wait ${waitSec}s before requesting another code.`,
        };
      }
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailVerificationOtp.deleteMany({
      where: { email: cleanEmail, type: params.type },
    });

    await prisma.emailVerificationOtp.create({
      data: {
        email: cleanEmail,
        code,
        type: params.type,
        metadata: lastOtp?.metadata || null,
        expiresAt,
      },
    });

    await sendOtpEmail({
      to: cleanEmail,
      code,
      type: params.type,
    });

    return {
      success: true,
      message: `A new 6-digit code was dispatched to ${cleanEmail}.`,
    };
  } catch (err: any) {
    console.error('Error in resendVerificationOtp:', err);
    return { success: false, error: err?.message || 'Failed to resend code.' };
  }
}

/**
 * Log out user by clearing the session cookie
 */
export async function logoutUser() {
  try {
    await clearSessionCookie();
    return { success: true };
  } catch (err) {
    console.error('Error in logoutUser:', err);
    return { success: false };
  }
}
