import { getRoomLiveState } from '@/app/actions/quiz';
import { CreatorDashboard } from '@/components/CreatorDashboard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ roomCode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomCode } = await params;
  return {
    title: `Room Dashboard #${roomCode} | CodeQuiz`,
  };
}

export default async function RoomDashboardPage({ params }: Props) {
  const { roomCode } = await params;
  const state = await getRoomLiveState(roomCode);

  if (!state) {
    notFound();
  }

  return <CreatorDashboard initialState={state} />;
}
