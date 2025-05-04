import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        // Optional: add pathname or port if needed
        // pathname: '/u/**', // Example: limit to specific paths
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        // Optional: add pathname or port if needed
        // pathname: '/u/**', // Example: limit to specific paths
      },
    ],
  },
};

export default nextConfig;
