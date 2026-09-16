import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth/session';
import { writeFile, readdir, unlink } from 'fs/promises';
import path from 'path';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || !authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let finalAvatarUrl: string | null = undefined as any;
    let newName: string | undefined = undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const preset = formData.get('preset') as string | null;
      const imageUrl = formData.get('imageUrl') as string | null;
      const remove = formData.get('remove') === 'true';
      const name = formData.get('name') as string | null;

      if (typeof name === 'string' && name.trim()) {
        newName = name.trim();
      }

      if (remove) {
        finalAvatarUrl = null;
      } else if (file && file.size > 0) {
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          return NextResponse.json(
            { error: 'Invalid file format. Supported: JPG, PNG, WEBP, GIF, SVG.' },
            { status: 400 }
          );
        }

        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'File exceeds 5MB size limit.' },
            { status: 400 }
          );
        }

        let ext = 'png';
        if (file.type === 'image/jpeg') ext = 'jpg';
        else if (file.type === 'image/webp') ext = 'webp';
        else if (file.type === 'image/gif') ext = 'gif';
        else if (file.type === 'image/svg+xml') ext = 'svg';

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

        if (isServerless) {
          finalAvatarUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
        } else {
          try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
            const fileName = `avatar-${authUser.userId}-${Date.now()}.${ext}`;
            const filePath = path.join(uploadsDir, fileName);

            try {
              const existingFiles = await readdir(uploadsDir);
              for (const f of existingFiles) {
                if (f.startsWith(`avatar-${authUser.userId}-`)) {
                  await unlink(path.join(uploadsDir, f)).catch(() => {});
                }
              }
            } catch {}

            await writeFile(filePath, buffer);
            finalAvatarUrl = `/uploads/avatars/${fileName}`;
          } catch (writeErr) {
            console.warn('Filesystem write failed, falling back to data URL:', writeErr);
            finalAvatarUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
          }
        }
      } else if (preset && preset.trim()) {
        finalAvatarUrl = preset.trim();
      } else if (imageUrl && imageUrl.trim()) {
        finalAvatarUrl = imageUrl.trim();
      }
    } else {
      const body = await request.json().catch(() => ({}));
      if (body.name && typeof body.name === 'string') {
        newName = body.name.trim();
      }
      if (body.remove) {
        finalAvatarUrl = null;
      } else if (body.preset) {
        finalAvatarUrl = body.preset;
      } else if (body.imageUrl) {
        finalAvatarUrl = body.imageUrl;
      }
    }

    // Sync avatar & name to Prisma database
    const updatedUser = await prisma.user.upsert({
      where: { clerkUserId: authUser.userId },
      update: {
        ...(finalAvatarUrl !== undefined ? { avatar: finalAvatarUrl } : {}),
        ...(newName !== undefined ? { name: newName } : {}),
      },
      create: {
        clerkUserId: authUser.userId,
        name: newName || authUser.name || 'Developer',
        avatar: finalAvatarUrl || null,
        email: authUser.email || null,
      },
    });

    if (newName) {
      await setSessionCookie({
        id: updatedUser.clerkUserId,
        email: updatedUser.email || authUser.email,
        name: updatedUser.name || newName,
        username: updatedUser.username,
      });
    }

    return NextResponse.json({
      success: true,
      avatarUrl: finalAvatarUrl,
      name: newName,
    });
  } catch (err: any) {
    console.error('Error handling avatar upload:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update avatar' },
      { status: 500 }
    );
  }
}
