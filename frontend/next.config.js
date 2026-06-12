/** @type {import('next').NextConfig} */

// Em CI (GitHub Pages) fazemos static export. O repo é servido em
// https://<org>.github.io/<repo>/, então precisamos de basePath/assetPrefix.
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,

  // Static export para GitHub Pages (sem servidor Node).
  ...(isStaticExport
    ? {
        output: 'export',
        images: { unoptimized: true },
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
      }
    : {
        // Em dev/local com backend, usamos rewrite para evitar CORS.
        async rewrites() {
          const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          return [{ source: '/backend/:path*', destination: `${api}/:path*` }];
        },
      }),
};

module.exports = nextConfig;
