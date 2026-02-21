import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/blesh',
  assetPrefix: '/blesh/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
