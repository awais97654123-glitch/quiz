import { RoomCodeInput } from '@/components/RoomCodeInput';
import { BackButton } from '@/components/BackButton';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Quiz | CodeQuiz',
};

export default function JoinQuizPage() {
  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-14 space-y-6">
      <BackButton fallbackUrl="/" label="Back to Home" />
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
          <Users className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Join a Quiz</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter the 8-digit room code shared by your quiz host to join the quiz room.
        </p>
      </div>
      <RoomCodeInput size="lg" />
    </div>
  );
}
