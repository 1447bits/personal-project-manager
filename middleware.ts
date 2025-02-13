// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
  // Exclude auth routes from middleware
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Get token from header
  const token = await getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Verify token
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Add user info to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('user', JSON.stringify(payload));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/api/tasks/:path*',
    '/api/projects/:path*',
    // Add other protected routes here
  ],
};