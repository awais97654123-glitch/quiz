import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'cq_session';
const SESSION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'codequiz-ultra-secure-hmac-sha256-auth-secret-key-2025';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  username?: string;
  exp: number; // Unix timestamp in ms
}

/**
 * Strong password hashing using PBKDF2 with SHA-512 and 100,000 iterations
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies password against PBKDF2 hashed string with constant-time equality
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP (e.g. 482910)
 */
export function generateOtp(): string {
  const min = 100000;
  const max = 999999;
  return String(crypto.randomInt(min, max + 1));
}

/**
 * Sign payload using HMAC-SHA256
 */
export function signToken(payload: SessionPayload): string {
  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadStr, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode HMAC-SHA256 token
 */
export function verifyToken(token: string): SessionPayload | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    const signatureBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (
      signatureBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(signatureBuf, expectedBuf)
    ) {
      return null;
    }

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Set session cookie in Next.js Server Action or Route Handler
 */
export async function setSessionCookie(user: {
  id: string;
  email: string;
  name: string;
  username?: string | null;
}) {
  const cookieStore = await cookies();
  const maxAgeDays = 30;
  const exp = Date.now() + maxAgeDays * 24 * 60 * 60 * 1000;

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    username: user.username || undefined,
    exp,
  };

  const token = signToken(payload);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeDays * 24 * 60 * 60,
  });

  return token;
}

/**
 * Read session cookie and verify payload
 */
export async function getSessionCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie || !cookie.value) return null;
  return verifyToken(cookie.value);
}

/**
 * Clear session cookie on logout
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
