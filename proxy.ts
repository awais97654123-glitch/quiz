import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('cq_session')?.value;
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const parts = sessionCookie.split('.');
      if (parts.length === 2 && parts[0]) {
        const decodedJson = Buffer.from(parts[0], 'base64url').toString('utf-8');
        const payload = JSON.parse(decodedJson);
        if (payload?.userId && payload?.exp && Date.now() < payload.exp) {
          isAuthenticated = true;
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith('/my-quizzes') ||
    pathname.startsWith('/create-quiz') ||
    pathname.startsWith('/challenge-vs');

  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
