/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // unoptimized: true, // Enabled image optimization
  },
  // Force dynamic rendering to avoid React 19 SSG issues
  experimental: {
    forceSwcTransforms: true,
    serverComponentsExternalPackages: [],
  },
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
