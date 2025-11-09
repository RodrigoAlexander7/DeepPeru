import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

/* 
req contains:
   - req.cookies -> acces to cookies
   - req.NextUrl -> the url that call --- if is 'localhost:3000/dashboard' will be 'dashboard'
      |-> URL de la solicitud, con métodos útiles como pathname, searchParams, etc.
   - req.headers -> the headers HTTP 
   - req.ip      -> the ip of the client (if it has one)
*/
export function middleware(req: NextRequest) {}
