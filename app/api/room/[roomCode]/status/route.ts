import { NextResponse } from 'next/server';
import { getRoomLiveState } from '@/app/actions/quiz';

export async function GET(
  request: Request,
  props: { params: Promise<{ roomCode: string }> }
) {
  try {
    const { roomCode } = await props.params;
    if (!roomCode) {
      return NextResponse.json({ error: 'Room code is required' }, { status: 400 });
    }
    const state = await getRoomLiveState(roomCode);

    if (!state) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error('API Error in /api/room/[roomCode]/status:', error);
    return NextResponse.json({ error: 'Failed to retrieve room status' }, { status: 500 });
  }
}
