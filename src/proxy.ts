import { NextResponse, type NextRequest } from "next/server";

// Central route guard (Next 16 proxy convention).
//
// Best-effort routing on session-cookie presence only: the proxy never
// touches the database (no Prisma/edge risk). Real authorization always
// happens server-side in pages and actions via requireAuth /
// requireVerifiedEmail / requireOrganizationMembership — a request
// without a valid session can never read protected data even if it
// reaches the route.
//
// Cookie names cover both Better Auth defaults: plain
// `better-auth.session_token` and the `__Secure-` prefixed variant used
// when secure cookies are enabled in production.

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

const hasSessionCookie = (request: NextRequest): boolean =>
  SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));

const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const signedIn = hasSessionCookie(request);

  if (pathname.startsWith("/dashboard") && !signedIn) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Password-reset links must work regardless of cookie state: a
  // signed-in browser opening an emailed reset link keeps its token.
  if (pathname === "/auth" || pathname.startsWith("/auth/")) {
    if (pathname.startsWith("/auth/reset-password")) {
      return NextResponse.next();
    }
    if (signedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};

export default proxy;
