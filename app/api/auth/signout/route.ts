import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    if (authOptions.events?.signOut) {
      await authOptions.events.signOut({ session, token: {} });
    }

    // Clear all cookies related to the session
    const cookiesToClear = [
      "next-auth.session-token",
      "next-auth.csrf-token",
      "next-auth.callback-url",
      "__Secure-next-auth.callback-url",
      "__Host-next-auth.csrf-token",
    ];

    const clearCookies = cookiesToClear.map((cookie) =>
      `${cookie}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
    );

    return NextResponse.json(
      { message: "Signed out successfully" },
      { 
        status: 200,
        headers: {
          "Set-Cookie": clearCookies.join(", "),
        },
      }
    );
  } else {
    return NextResponse.json(
      { message: "No active session found" },
      { status: 400 }
    );
  }
}
