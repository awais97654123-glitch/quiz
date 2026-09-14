import { NextResponse } from 'next/server';
import { getAuthUser } from '@/app/actions/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
