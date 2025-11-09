import { NextResponse, type NextRequest } from 'next/server';
import { composedMiddleware } from '@/middleware';
import { protectedRoutes, authRoutes } from '@/config/protectedRoutes';

export function middleware(req: NextRequest) {
  const result = composedMiddleware(req);
  return result ?? NextResponse.next();
}

export const config = {
  matcher: [...protectedRoutes.map((r) => `${r}/:path*`), ...authRoutes],
};
