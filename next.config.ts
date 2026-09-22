import type { NextConfig } from "next";

/**
 * Production security headers (Phase 3).
 *
 * Deliberately conservative Content-Security-Policy: Next.js, Framer
 * Motion, and local fonts require 'unsafe-inline' (styles) and
 * 'unsafe-eval' (dev/build runtime) for scripts — documented exceptions
 * below rather than a blindly restrictive policy that would break the
 * app or Better Auth. Everything else stays locked down:
 * - frame-ancestors 'none' (+ X-Frame-Options) against clickjacking
 * - object-src 'none', base-uri/form-action 'self'
 * - images self + data/blob (avatars, generated assets)
 * - connect self + ws/wss (dev HMR; harmless in production)
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' ws: wss:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // HTTPS-only directive. Browsers ignore it on http:// origins, so
  // local http development and E2E are unaffected; production HTTPS
  // deployments get HSTS enforcement.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: SECURITY_HEADERS,
    },
  ],
};

export default nextConfig;
