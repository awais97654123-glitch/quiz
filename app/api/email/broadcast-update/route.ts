import { NextRequest, NextResponse } from 'next/server';
import { broadcastPlatformUpdateToAllStudents } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { updateTitle, updateSummary, features } = body;

    const title = updateTitle || 'Major Feature Release & Duel Arena Upgrades';
    const summary =
      updateSummary ||
      'We have rolled out major updates to CodeQuiz Arena, including real-time 1v1 friend challenges, Olympic leaderboard rankings, and enhanced sound effects!';
    const featureList = Array.isArray(features) && features.length > 0
      ? features
      : [
          '⚔️ 1v1 Realtime Developer Duel Arena with Live Score Sync',
          '🏆 International Olympic Leaderboard with Podiums & Inactivity Decay',
          '⚡ Interactive Frosted Glass UI with Dynamic Micro-Animations',
          '🎵 Curated Ambient Battle BGM for Focus & Engagement',
          '📬 Automatic Email Notifications for Friend Requests & Achievements',
        ];

    const result = await broadcastPlatformUpdateToAllStudents({
      updateTitle: title,
      updateSummary: summary,
      features: featureList,
    });

    return NextResponse.json({
      success: true,
      message: 'Platform update broadcast successfully executed.',
      details: result,
    });
  } catch (err: any) {
    console.error('[Broadcast Update API Error]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to broadcast update' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Ready',
    description: 'Send a POST request with { updateTitle, updateSummary, features } to broadcast news to all registered student developers.',
  });
}
