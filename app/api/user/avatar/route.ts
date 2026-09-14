import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
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
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        // Determine extension
        let ext = 'png';
        if (file.type === 'image/jpeg') ext = 'jpg';
        else if (file.type === 'image/webp') ext = 'webp';
        else if (file.type === 'image/gif') ext = 'gif';
        else if (file.type === 'image/svg+xml') ext = 'svg';

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
        const fileName = `avatar-${user.id}-${Date.now()}.${ext}`;
        const filePath = path.join(uploadsDir, fileName);

        // Clean up previous uploads for this user
        try {
          const existingFiles = await readdir(uploadsDir);
          for (const f of existingFiles) {
            if (f.startsWith(`avatar-${user.id}-`)) {
              await unlink(path.join(uploadsDir, f)).catch(() => {});
            }
          }
        } catch {}

        await writeFile(filePath, buffer);
        finalAvatarUrl = `/uploads/avatars/${fileName}`;
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

    const updates: Record<string, any> = {};
    if (newName !== undefined) {
      updates.full_name = newName;
      updates.name = newName;
    }
    if (finalAvatarUrl !== undefined) {
      updates.avatar_url = finalAvatarUrl;
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: updates,
      });

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      // Sync avatar & name to Prisma database so Leaderboard and Duels show live avatar
      try {
        await prisma.user.upsert({
          where: { clerkUserId: user.id },
          update: {
            ...(finalAvatarUrl !== undefined ? { avatar: finalAvatarUrl } : {}),
            ...(newName !== undefined ? { name: newName } : {}),
          },
          create: {
            clerkUserId: user.id,
            name: newName || user.user_metadata?.name || 'Developer',
            avatar: finalAvatarUrl || null,
            email: user.email || null,
          },
        });
      } catch (dbErr) {
        console.error('Failed to sync avatar to database:', dbErr);
      }
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
