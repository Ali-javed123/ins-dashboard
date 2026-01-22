import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Strict Mode off
// output:"export" ,
  
  typescript: {
    // During builds ignore TypeScript errors
    ignoreBuildErrors: true,
  },
  
    images: {
    // allow any external domain if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // optional: disables optimization for all images
  },

};

export default nextConfig;
