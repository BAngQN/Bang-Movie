import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase_admin";

export function proxy(request: NextRequest) {
    const session = request.cookies.get("session");
    console.log("my session:", session);
    return adminAuth
        .verifyIdToken(session?.value || "")
        .then(() => {
            // Token is valid, allow the request to proceed
            NextResponse.next();
        })
        .catch(() => {
            // Token is invalid or missing, redirect to login
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
            NextResponse.redirect(loginUrl);
        });
}

export const config = {
    matcher: ["/favorites/:path*"],
};
