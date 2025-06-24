import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Just pass through - let the API routes set their own headers
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/api/:path*',
};