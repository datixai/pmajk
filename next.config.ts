import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const isDev = process.env.NODE_ENV === "development";

// Public pages are static (served from cache), so they use a fixed policy.
// The admin panel gets a stricter per-request nonce policy in src/proxy.ts.
const publicCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  // Bundle the seed content with the server functions (read-only hosting).
  outputFileTracingIncludes: { "/**": ["./data/seed.json"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    qualities: [70, 75],
  },
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/((?!admin).*)", headers: [{ key: "Content-Security-Policy", value: publicCsp }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
    ];
  },
  async rewrites() {
    // Browsers still ask for /favicon.ico; serve the chinar leaf icon.
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
  async redirects() {
    // Keep the addresses of the old WordPress site working. Old press release
    // addresses are redirected by the pages themselves (see oldSlugs).
    return [
      { source: "/about", destination: "/prime-minister", permanent: true },
      { source: "/organogram", destination: "/pm-office", permanent: true },
      { source: "/political", destination: "/pm-office#political-wing", permanent: true },
      { source: "/blog", destination: "/newsroom", permanent: true },
      { source: "/news", destination: "/notifications", permanent: true },
      { source: "/updates", destination: "/gallery", permanent: true },
      { source: "/latest-updates", destination: "/gallery", permanent: true },
      { source: "/image-and-video-gallery", destination: "/gallery", permanent: true },
      { source: "/ajk-at-glance", destination: "/ajk-at-a-glance", permanent: true },
      { source: "/category/:path*", destination: "/newsroom", permanent: true },
      { source: "/feed", destination: "/newsroom", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
