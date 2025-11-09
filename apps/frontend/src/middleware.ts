import { NextResponse, NextRequest } from 'next/server';

import { composedMiddleware } from '@/middleware/main';

export function middleware(req: NextRequest) {
  console.log('🚀 MIDDLEWARE EJECUTÁNDOSE');
  console.log('📍 Pathname:', req.nextUrl.pathname);
  console.log('🍪 Cookies:', req.cookies.getAll());
  console.log('🔑 Token:', req.cookies.get('access_token')?.value);

  const result = composedMiddleware(req);
  return result ?? NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/admin/:path*'],
};
