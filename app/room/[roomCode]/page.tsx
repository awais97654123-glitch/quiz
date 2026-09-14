import { getRoomDetails } from '@/app/actions/quiz';
import { RoomJoinConfirmation } from '@/components/RoomJoinConfirmation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ roomCode: string }>;
}

export default async function RoomPage({ params }: Props) {
  const { roomCode } = await params;
  const room = await getRoomDetails(roomCode);

  if (!room) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-24 text-center">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Room Not Found</h2>
          <p className="text-xs text-slate-400">No quiz room found with code <strong className="text-white font-mono">{roomCode}</strong>. Please check the code and try again.</p>
          <Link href="/join-quiz" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 py-12 md:py-16">
      <RoomJoinConfirmation room={room} />
    </div>
  );
}
