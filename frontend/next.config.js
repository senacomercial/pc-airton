/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Proxy de API para o backend NestJS (evita CORS em dev).
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return [{ source: '/backend/:path*', destination: `${api}/:path*` }];
  },
};

module.exports = nextConfig;
