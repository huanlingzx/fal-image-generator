import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
        port: '', // Leave empty if no specific port is needed
        pathname: '/files/**', // Allow any path under /files/
      },
      // Add other hostnames here if you use images from different external sources
    ],
  },
  // Other Next.js configurations can go here
};

export default nextConfig;
