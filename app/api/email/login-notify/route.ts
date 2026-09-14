import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail, sendLoginNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name, username, type } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 });
    }

    const cleanEmail = email.trim();

    // Look up user in database if name or username not directly provided
    const userRecord = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { username: username || undefined }],
      },
      select: {
        name: true,
        username: true,
        email: true,
      },
    }).catch(() => null);

    const displayName = name || userRecord?.name || userRecord?.username || cleanEmail.split('@')[0];
    const displayUsername = username || userRecord?.username || undefined;

    // Send silently in background without blocking
    if (type === 'signup') {
      void sendWelcomeEmail({
        to: cleanEmail,
        name: displayName,
        username: displayUsername,
      }).catch((err) => console.error('[Resend Silent Welcome Error]', err));
    } else {
      void sendLoginNotificationEmail({
        to: cleanEmail,
        name: displayName,
        username: displayUsername,
        loginTime: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      }).catch((err) => console.error('[Resend Silent Login Error]', err));
    }

    return NextResponse.json({ success: true, message: 'Notification queued' });
  } catch (err: any) {
    console.error('[Login Notify API Error]', err);
    // Still return 200/success true so client UI never breaks or alerts user
    return NextResponse.json({ success: true });
  }
}
