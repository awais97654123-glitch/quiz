import { NextResponse } from 'next/server';
import { logoutUser } from '@/app/actions/auth';

export async function POST(req: Request) {
  await logoutUser();
  const url = new URL('/login', req.url);
  return NextResponse.redirect(url);
}

export async function GET(req: Request) {
  await logoutUser();
  const url = new URL('/login', req.url);
  return NextResponse.redirect(url);
}
