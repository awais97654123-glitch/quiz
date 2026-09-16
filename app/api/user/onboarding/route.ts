import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/app/actions/auth';
import { setSessionCookie } from '@/lib/auth/session';
import { ensureDatabaseSchema } from '@/lib/db-init';

const VALID_INSTITUTION_TYPES = new Set(['SCHOOL', 'COLLEGE', 'UNIVERSITY']);
const VALID_CODING_LEVELS = new Set(['BEGINNER', 'INTERMEDIATE', 'EXPERT']);
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSchema().catch(() => {});
    const authUser = await getAuthUser();

    if (!authUser || !authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, username, institutionType, institutionName, codingLevel } = body;

    // Validate Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name (minimum 2 characters).' },
        { status: 400 }
      );
    }
    const cleanName = name.trim();

    // Validate Username
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid username.' },
        { status: 400 }
      );
    }
    const normalizedUsername = username.trim().toLowerCase().replace(/^@/, '');

    if (!USERNAME_REGEX.test(normalizedUsername)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters long using only letters, numbers, and underscores.' },
        { status: 400 }
      );
    }

    // Check unique username in Database
    const existingUser = await prisma.user.findFirst({
      where: {
        username: { equals: normalizedUsername },
        NOT: { clerkUserId: authUser.userId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: `The username @${normalizedUsername} is already registered by another developer. Please choose a unique one.` },
        { status: 409 }
      );
    }

    // Validate Institution Type & Name
    const cleanInstType = String(institutionType || '').toUpperCase();
    if (!VALID_INSTITUTION_TYPES.has(cleanInstType)) {
      return NextResponse.json(
        { error: 'Please select your institution type: School, College, or University.' },
        { status: 400 }
      );
    }

    if (!institutionName || typeof institutionName !== 'string' || institutionName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter the name of your School, College, or University.' },
        { status: 400 }
      );
    }
    const cleanInstName = institutionName.trim();

    // Validate Coding Level
    const cleanCodingLevel = String(codingLevel || '').toUpperCase();
    if (!VALID_CODING_LEVELS.has(cleanCodingLevel)) {
      return NextResponse.json(
        { error: 'Please select your coding experience: Beginner, Intermediate, or Expert.' },
        { status: 400 }
      );
    }

    // Update in Prisma Database
    const updatedUser = await prisma.user.upsert({
      where: { clerkUserId: authUser.userId },
      update: {
        name: cleanName,
        username: normalizedUsername,
        institutionType: cleanInstType,
        institutionName: cleanInstName,
        codingLevel: cleanCodingLevel,
        email: authUser.email || null,
      },
      create: {
        clerkUserId: authUser.userId,
        name: cleanName,
        username: normalizedUsername,
        institutionType: cleanInstType,
        institutionName: cleanInstName,
        codingLevel: cleanCodingLevel,
        email: authUser.email || null,
      },
    });

    // Refresh session cookie with username
    await setSessionCookie({
      id: updatedUser.clerkUserId,
      email: updatedUser.email || authUser.email,
      name: updatedUser.name || cleanName,
      username: updatedUser.username,
    });

    // Trigger silent Welcome Email via Resend in the background
    if (authUser.email) {
      const { sendWelcomeEmail } = await import('@/lib/email');
      void sendWelcomeEmail({
        to: authUser.email,
        name: cleanName,
        username: normalizedUsername,
      }).catch((err) => console.error('[Resend Onboarding Welcome Error]', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Developer profile successfully initialized!',
      profile: {
        name: cleanName,
        username: normalizedUsername,
        institutionType: cleanInstType,
        institutionName: cleanInstName,
        codingLevel: cleanCodingLevel,
      },
    });
  } catch (err: any) {
    console.error('Error in onboarding API:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to complete onboarding.' },
      { status: 500 }
    );
  }
}
