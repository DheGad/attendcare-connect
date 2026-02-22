import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'fallback_production_secret_key_123456789',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
