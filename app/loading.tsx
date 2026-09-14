import { Zap } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
      <div className="relative flex items-center justify-center mb-6">
        {/* Ambient Glow */}
        <div className="absolute w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

        {/* Outer Spinning Ring */}
        <div className="w-20 h-20 rounded-full border-2 border-slate-800 border-t-cyan-400 border-r-indigo-500 animate-spin" />

        {/* Inner Icon */}
        <div className="absolute w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center">
          <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
      </div>

    </div>
  );
}
