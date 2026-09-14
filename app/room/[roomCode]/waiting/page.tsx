import { getRoomLiveState } from '@/app/actions/quiz';
import { WaitingRoom } from '@/components/WaitingRoom';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ roomCode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomCode } = await params;
  return {
    title: `Waiting Room #${roomCode} | CodeQuiz`,
  };
}

export default async function WaitingRoomPage({ params }: Props) {
  const { roomCode } = await params;
  const state = await getRoomLiveState(roomCode);

  if (!state) {
    notFound();
  }

  return <WaitingRoom initialState={state} />;
}
