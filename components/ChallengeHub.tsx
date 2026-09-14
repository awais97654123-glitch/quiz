'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import {
  searchFriendsByUsername,
  createFriendChallenge,
  respondToChallenge,
  ChallengeUserSearchResult,
} from '@/app/actions/challenge';
import { createClient } from '@/lib/supabase/client';
import {
  Swords,
  Search,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Code2,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Trophy,
  History,
  Send,
  Zap,
  Users,
  Check,
  X,
} from 'lucide-react';

interface CourseOption {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  badge?: string | null;
  description: string;
  _count: { questions: number };
}

interface ChallengeHubProps {
  courses: CourseOption[];
  initialPendingIncoming: any[];
  initialPendingOutgoing: any[];
  initialRecentCompleted: any[];
  suggestedFriends: ChallengeUserSearchResult[];
}

export function ChallengeHub({
  courses,
  initialPendingIncoming,
  initialPendingOutgoing,
  initialRecentCompleted,
  suggestedFriends = [],
}: ChallengeHubProps) {
  const router = useRouter();
  const supabase = createClient();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChallengeUserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<ChallengeUserSearchResult | null>(null);

  // Configuration state
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitSec, setTimeLimitSec] = useState<number>(300);

  // Status state
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Challenges list state
  const [pendingIncoming, setPendingIncoming] = useState(initialPendingIncoming);
  const [pendingOutgoing, setPendingOutgoing] = useState(initialPendingOutgoing);
  const [activeTab, setActiveTab] = useState<'hub' | 'incoming' | 'outgoing' | 'history'>('hub');

  // Debounced friend search
  useEffect(() => {
    const clean = searchQuery.trim().toLowerCase().replace(/^@/, '');
    if (clean.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchFriendsByUsername(clean);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle challenge request dispatch
  const handleSendChallenge = async () => {
    if (!selectedOpponent) {
      setErrorMsg('Please select a friend to challenge.');
      return;
    }

    if (!selectedCourseId) {
      setErrorMsg('Please select a quiz course battlefield.');
      return;
    }

    setIsSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await createFriendChallenge({
        opponentId: selectedOpponent.id,
        courseId: selectedCourseId,
        totalQuestions: questionCount,
        timeLimitSec,
      });

      if (!res.success || !res.challengeId) {
        throw new Error(res.error || 'Failed to send challenge request.');
      }

      // Broadcast challenge to opponent's personal channel for immediate notification
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      const selectedCourse = courses.find((c) => c.id === selectedCourseId);

      if (currentUser) {
        const notifyChannel = supabase.channel(`user-notifications:${selectedOpponent.id}`);
        await notifyChannel.send({
          type: 'broadcast',
          event: 'challenge_received',
          payload: {
            challengeId: res.challengeId,
            challengerId: currentUser.id,
            challengerName: currentUser.user_metadata?.name || 'A Friend',
            challengerUsername: currentUser.user_metadata?.username || null,
            challengerAvatar: currentUser.user_metadata?.avatar_url || null,
            courseName: selectedCourse?.name || 'Quiz Course',
            totalQuestions: questionCount,
            timeLimitSec,
          },
        });
      }

      setSuccessMsg(
        `Challenge sent to @${selectedOpponent.username || selectedOpponent.name}! Waiting for them to accept...`
      );

      // Add to outgoing list
      setPendingOutgoing((prev) => [
        {
          id: res.challengeId,
          course: selectedCourse,
          opponentName: selectedOpponent.name,
          opponentUsername: selectedOpponent.username,
          opponentAvatar: selectedOpponent.avatar,
          totalQuestions: questionCount,
          timeLimitSec,
          createdAt: new Date().toISOString(),
          status: 'PENDING',
        },
        ...prev,
      ]);

      // Reset selection after 2.5 seconds
      setTimeout(() => {
        setSelectedOpponent(null);
        setSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error dispatching challenge.');
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    try {
      const res = await respondToChallenge({ challengeId, action: 'ACCEPT' });
      if (res.success) {
        router.push(`/challenge-vs/${challengeId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineChallenge = async (challengeId: string) => {
    try {
      await respondToChallenge({ challengeId, action: 'REJECT' });
      setPendingIncoming((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6 animate-fade-in select-none">
      <BackButton fallbackUrl="/" label="Back to Home" />

      {/* Header Banner - Friend Room exact requested copy */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/40 border border-rose-500/30 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>1v1 REALTIME DEVELOPER DUEL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Friend Room •{' '}
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              Challenge Friends in a 1v1 Code Duel
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Pick a friend by username, choose your battlefield language, and enter the arena. Both players answer randomized questions.{' '}
            <strong className="text-white font-bold">Highest score wins; fastest time breaks ties!</strong>
          </p>
        </div>
      </div>

      {/* Navigation Pills (Hub, Incoming, Outgoing, History) */}
      <div className="flex items-center justify-start sm:justify-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x">
        <button
          type="button"
          onClick={() => setActiveTab('hub')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'hub'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Duel Arena</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('incoming')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative whitespace-nowrap shrink-0 ${
            activeTab === 'incoming'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Incoming Requests</span>
          {pendingIncoming.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
              {pendingIncoming.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'outgoing'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests</span>
          {pendingOutgoing.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
              {pendingOutgoing.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'history'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Match History</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB: DUEL ARENA (SEARCH & CONFIGURE) */}
      {/* ============================================================ */}
      {activeTab === 'hub' && (
        <div className="space-y-8">
          {!selectedOpponent ? (
            /* STEP 1: Center Search Bar + Recent Friends */
            <div className="space-y-8 max-w-2xl mx-auto">
              {/* Center Prominent Search Bar */}
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-extrabold text-white">
                  Search Friend by Username
                </h3>
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type friend's @username or full name..."
                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border-2 border-slate-800 text-base font-semibold text-white focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all placeholder:text-slate-500 shadow-xl"
                  />
                  {isSearching && (
                    <Loader2 className="w-5 h-5 text-rose-400 animate-spin absolute right-4 top-4" />
                  )}
                </div>

                {/* Auto-complete Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-1 text-left animate-fade-in">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedOpponent(user);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="w-full p-3 rounded-xl hover:bg-slate-800/90 border border-transparent hover:border-slate-700 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 p-0.5 shrink-0 overflow-hidden">
                            {user.avatar ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={user.avatar}
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-[8px]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-slate-950 rounded-[8px]">
                                {(user.name || 'U')[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                              {user.name}
                            </div>
                            <div className="text-xs font-mono text-cyan-400">
                              @{user.username}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                                <Trophy className="w-2.5 h-2.5 text-amber-400" />
                                {user.totalScore?.toLocaleString() ?? 0} pts
                              </span>
                              {user.codingLevel && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                                  {user.codingLevel}
                                </span>
                              )}
                              {user.rankBadge && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                                  user.rankBadge === 'GRANDMASTER'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : user.rankBadge === 'MASTER'
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    : user.rankBadge === 'CHAMPION'
                                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                  {user.rankBadge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5">
                          <span>Select</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent & Suggested Friends List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-400" />
                    <span>Recent & Suggested Friends</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">1-Click Challenge</span>
                </div>

                {suggestedFriends.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
                    Type a username in the search bar above to challenge your first friend!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedFriends.map((friend) => (
                      <button
                        key={friend.id}
                        type="button"
                        onClick={() => setSelectedOpponent(friend)}
                        className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-850/80 transition-all text-left flex items-center justify-between gap-3 group cursor-pointer shadow-sm hover:shadow-rose-950/20"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 overflow-hidden">
                            {friend.avatar ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={friend.avatar}
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-[9px]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-slate-950 rounded-[9px]">
                                {(friend.name || 'F')[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-rose-300 transition-colors">
                              {friend.name}
                            </div>
                            <div className="text-[11px] font-mono text-cyan-400 truncate">
                              @{friend.username}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                                <Trophy className="w-2.5 h-2.5 text-amber-400" />
                                {friend.totalScore?.toLocaleString() ?? 0}
                              </span>
                              {friend.codingLevel && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                                  {friend.codingLevel}
                                </span>
                              )}
                              {friend.rankBadge && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                                  friend.rankBadge === 'GRANDMASTER'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : friend.rankBadge === 'MASTER'
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    : friend.rankBadge === 'CHAMPION'
                                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                  {friend.rankBadge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 group-hover:bg-rose-500/30 text-rose-300 text-xs font-bold shrink-0 transition-all flex items-center gap-1">
                          <Swords className="w-3.5 h-3.5" />
                          <span>Duel</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STEP 2: Selected Friend + Course Selection + Full Challenge Request Box */
            <div className="space-y-8 animate-fade-in">
              {/* Top Navigation Back */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedOpponent(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Different Friend</span>
                </button>

                <span className="text-xs text-slate-400">
                  Step 2 of 2 • Battlefield Setup
                </span>
              </div>

              {/* Selected Friend Highlight Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border-2 border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 overflow-hidden shadow-lg shadow-rose-950/50">
                    {selectedOpponent.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedOpponent.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-xl text-white bg-slate-950 rounded-[14px]">
                        {(selectedOpponent.name || 'F')[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                      Selected Opponent
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                      <span>{selectedOpponent.name}</span>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        @{selectedOpponent.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap justify-center sm:justify-start">
                      {selectedOpponent.institutionName && <span>{selectedOpponent.institutionName} •</span>}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        {selectedOpponent.totalScore?.toLocaleString() ?? 0} pts
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {selectedOpponent.codingLevel || 'Beginner'}
                      </span>
                      {selectedOpponent.rankBadge && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                          selectedOpponent.rankBadge === 'GRANDMASTER'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : selectedOpponent.rankBadge === 'MASTER'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : selectedOpponent.rankBadge === 'CHAMPION'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {selectedOpponent.rankBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                  <span>Ready for Duel</span>
                </div>
              </div>

              {/* Course Battlefield Selection Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>Select Battlefield Language / Course</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Both players receive randomized questions
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {courses.map((course) => {
                    const isSelected = selectedCourseId === course.id;
                    return (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/20'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{course.icon || '⚡'}</span>
                            <div>
                              <div className="text-sm font-bold text-white">{course.name}</div>
                              <span className="text-[11px] text-slate-400">
                                {course._count.questions} Questions
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {course.badge && (
                          <span className="self-start text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {course.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Match Format Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                {/* Questions Count */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Number of Questions</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          questionCount === count
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Limit */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Battle Time Limit</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { sec: 180, label: '3 Mins' },
                      { sec: 300, label: '5 Mins' },
                      { sec: 600, label: '10 Mins' },
                    ].map((item) => (
                      <button
                        key={item.sec}
                        type="button"
                        onClick={() => setTimeLimitSec(item.sec)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          timeLimitSec === item.sec
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status alerts */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Large, Full Design Send Challenge Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendChallenge}
                  disabled={isSending}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-rose-600/40 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
                      <span>Dispatching Challenge Request...</span>
                    </>
                  ) : (
                    <>
                      <Swords className="w-6 h-6 text-slate-950" />
                      <span>Send Challenge Request to @{selectedOpponent.username || selectedOpponent.name}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: INCOMING REQUESTS */}
      {/* ============================================================ */}
      {activeTab === 'incoming' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-400" />
              <span>Incoming Battle Challenges ({pendingIncoming.length})</span>
            </h3>
          </div>

          {pendingIncoming.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-2">
              <Swords className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No Pending Challenges</div>
              <div className="text-xs text-slate-500">
                When friends challenge you, they will appear right here!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingIncoming.map((chal) => (
                <div
                  key={chal.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 p-0.5 overflow-hidden shrink-0">
                      {chal.challengerAvatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={chal.challengerAvatar}
                          alt="Challenger"
                          className="w-full h-full object-cover rounded-[10px]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white bg-slate-950 rounded-[10px]">
                          {chal.challengerName[0]?.toUpperCase() || 'C'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {chal.challengerName}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="text-amber-400 font-semibold">{chal.course?.name}</span>
                        <span>•</span>
                        <span>{chal.totalQuestions} Questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleDeclineChallenge(chal.id)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptChallenge(chal.id)}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:from-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Accept Battle</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: OUTGOING REQUESTS */}
      {/* ============================================================ */}
      {activeTab === 'outgoing' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Pending Sent Challenges ({pendingOutgoing.length})</span>
            </h3>
          </div>

          {pendingOutgoing.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-2">
              <Send className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No Outgoing Challenges</div>
              <div className="text-xs text-slate-500">
                You haven&apos;t sent any pending challenge requests.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOutgoing.map((chal) => (
                <div
                  key={chal.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white">
                      {chal.opponentName[0]?.toUpperCase() || 'O'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        To: {chal.opponentName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {chal.course?.name} • {chal.totalQuestions} Qs
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Awaiting Acceptance</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: MATCH HISTORY */}
      {/* ============================================================ */}
      {activeTab === 'history' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Recent 1v1 Battle History</span>
            </h3>
          </div>

          {initialRecentCompleted.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-2">
              <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No Matches Completed Yet</div>
              <div className="text-xs text-slate-500">
                Complete 1v1 battles with friends to see results here!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {initialRecentCompleted.map((match) => (
                <div
                  key={match.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {match.challengerName} vs {match.opponentName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {match.course?.name} • {match.totalQuestions} Questions
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/challenge-vs/${match.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 transition-all"
                  >
                    View Result →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
