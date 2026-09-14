import { NextResponse } from 'next/server';
import { logRoomActivity } from '@/app/actions/quiz';

export async function POST(
  request: Request,
  props: { params: Promise<{ roomCode: string }> }
) {
  try {
    const { roomCode } = await props.params;
    if (!roomCode) {
      return NextResponse.json({ error: 'roomCode required' }, { status: 400 });
    }
    const body = await request.json();
    const { eventType, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'eventType required' }, { status: 400 });
    }

    await logRoomActivity(roomCode, eventType, metadata);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activity API error:', error);
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}
