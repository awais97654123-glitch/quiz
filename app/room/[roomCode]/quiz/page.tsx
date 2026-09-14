import { getRoomQuestions } from '@/app/actions/quiz';
import { RoomQuizWrapper } from '@/components/RoomQuizWrapper';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ roomCode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomCode } = await params;
  return {
    title: `Live Quiz #${roomCode} | CodeQuiz`,
  };
}

export default async function RoomQuizPage({ params }: Props) {
  const { roomCode } = await params;

  let roomData = null;
  try {
    roomData = await getRoomQuestions(roomCode);
  } catch {
    notFound();
  }

  if (!roomData) {
    notFound();
  }

  return (
    <RoomQuizWrapper
      roomCode={roomData.roomCode}
      quizName={roomData.quizName}
      courseName={roomData.courseName}
      timeLimit={roomData.timeLimit}
      questions={roomData.questions}
    />
  );
}
