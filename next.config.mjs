/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // local
    NEXT_PUBLIC_SITE_URL: 'https://aims-ibs-website.vercel.app',
    // production
    // NEXT_PUBLIC_SITE_URL: 'https://www.aimsibs.com',
    IMG_PATH: '/',
  },

  // ── Upload body-size limits ───────────────────────────────────
  // Next.js buffers request bodies through middleware with a default 10 MB
  // cap. Raising it here covers ALL routes; the upload routes are also
  // excluded from the middleware matcher so the body is never buffered twice.
  experimental: {
    // Allow up to 200 MB for large video uploads passing through middleware.
    // (Upload routes are excluded from the middleware matcher, so this is
    //  mainly a safety net for other large requests.)
    middlewareClientMaxBodySize: 200 * 1024 * 1024, // 200 MB in bytes
  },

  images: {
    // Allow Next.js <Image> to serve Cloudinary-hosted images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
