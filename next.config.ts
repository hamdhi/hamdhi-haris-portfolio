import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: { dangerouslyAllowSVG: true, remotePatterns: [{ protocol: 'https', hostname: 'cdn.jsdelivr.net', pathname: '/gh/devicons/devicon/**' }] } 
};

export default nextConfig;
