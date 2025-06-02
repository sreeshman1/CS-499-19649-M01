import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; 

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyToken(token) {
  if (!token || !JWT_SECRET) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('travlr-token')?.value;

  // Define admin paths that require authentication
  const adminPaths = ['/admin/list-trips', '/admin/add-trip', '/admin/edit-trip'];

  if (adminPaths.some(path => pathname.startsWith(path))) {
    const userPayload = await verifyToken(token);
    if (!userPayload) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};