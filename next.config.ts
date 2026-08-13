import type { NextConfig } from "next";

// Security headers ported from staticwebapp.config.json so they apply on a
// Node.js host (Vercel / Azure App Service / Docker) now that we run a server.
// `headers()` is a no-op under `output: "export"`, which is why this only works
// after dropping the static export.
const isDev = process.env.NODE_ENV !== "production";

const ContentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: blob: https:",
  // Next.js injects inline bootstrap scripts; dev/HMR additionally needs eval.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  // Server deployment (Path B): API routes + next/image optimization work natively.
  // Standalone output lets us build locally and deploy just the traced
  // server + prod deps, instead of running npm install/next build on the
  // (shared, resource-constrained) App Service instance.
  output: "standalone",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;