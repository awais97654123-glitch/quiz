import { redirect } from 'next/navigation';
import { getAuthUser } from '@/app/actions/auth';
import { EditAvatarStudio } from '@/components/EditAvatarStudio';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customize Avatar | CodeQuiz',
  description: 'Upload custom profile photos or choose handcrafted developer personas for your CodeQuiz profile.',
};

export const dynamic = 'force-dynamic';

export default async function EditAvatarPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login?redirect_url=/profile/edit-avatar');
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-start">
      <EditAvatarStudio
        initialAvatar={user.avatar}
        initialName={user.name}
        userEmail={user.email}
      />
    </main>
  );
}
