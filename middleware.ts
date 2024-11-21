import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    '/donor/:path*',
    '/admin/:path*',
    '/donor',
    '/admin',
  ],
};

export async function middleware(request: NextRequest) {
  try {        
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
      cookieName: 'next-auth.session-token',
    });
    
    if (!token) {
      console.log("No token found, redirecting to login");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if ((request.nextUrl.pathname.startsWith('/donor') && token.userType !== 'donor') ||
        (request.nextUrl.pathname.startsWith('/admin') && token.userType !== 'admin')) {
      console.log(`Invalid user type ${token.userType} for path ${request.nextUrl.pathname}`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log("Token found, user is authenticated");
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
