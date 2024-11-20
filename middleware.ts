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
    });

    if (!token) {
      console.log("No token found, redirecting to login");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (request.nextUrl.pathname === '/donor' && token.userType !== 'donor') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname === '/admin' && token.userType !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log("Token found, user is authenticated");
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
