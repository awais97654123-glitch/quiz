import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/app/actions/auth';
import { ensureDatabaseSchema } from '@/lib/db-init';

const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'root',
  'api',
  'quiz',
  'codequiz',
  'mod',
  'moderator',
  'system',
  'support',
  'help',
  'official',
  'superuser',
]);

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUsername = searchParams.get('username') || '';
    const normalized = rawUsername.trim().toLowerCase().replace(/^@/, '');

    if (!normalized) {
      return NextResponse.json({
        available: false,
        message: 'Username cannot be empty.',
      });
    }

    if (normalized.length < 3) {
      return NextResponse.json({
        available: false,
        message: 'Username must be at least 3 characters.',
      });
    }

    if (normalized.length > 20) {
      return NextResponse.json({
        available: false,
        message: 'Username cannot exceed 20 characters.',
      });
    }

    if (!USERNAME_REGEX.test(normalized)) {
      return NextResponse.json({
        available: false,
        message: 'Only letters, numbers, and underscores are allowed.',
      });
    }

    if (RESERVED_USERNAMES.has(normalized)) {
      return NextResponse.json({
        available: false,
        message: 'This username is reserved by system.',
      });
    }

    // Ensure database tables exist without crashing
    await ensureDatabaseSchema().catch(() => {});

    // Check if the current user already owns this username
    const currentUser = await getAuthUser().catch(() => null);

    let existingUser = null;
    try {
      existingUser = await prisma.user.findFirst({
        where: {
          username: {
            equals: normalized,
          },
        },
      });
    } catch {
      // If DB is initializing, assume username is available
      return NextResponse.json({
        available: true,
        message: `@${normalized} is available!`,
      });
    }

    if (existingUser) {
      if (currentUser && existingUser.clerkUserId === currentUser.userId) {
        return NextResponse.json({
          available: true,
          message: 'This is your current username.',
        });
      }

      // Generate 3 unique available suggestions
      const suggestions: string[] = [];
      const baseVariants = [
        `${normalized}_dev`,
        `${normalized}_${Math.floor(10 + Math.random() * 90)}`,
        `${normalized}_pro`,
      ];

      for (const variant of baseVariants) {
        try {
          const taken = await prisma.user.findFirst({
            where: { username: { equals: variant } },
          });
          if (!taken) {
            suggestions.push(variant);
          }
        } catch {
          // ignore
        }
      }

      return NextResponse.json({
        available: false,
        message: `@${normalized} is already taken.`,
        suggestions,
      });
    }

    return NextResponse.json({
      available: true,
      message: `@${normalized} is available!`,
    });
  } catch (err: any) {
    console.error('Notice in check username:', err);
    return NextResponse.json({
      available: true,
      message: 'Username format is valid.',
    });
  }
}
