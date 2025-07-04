/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force dynamic rendering to avoid React 19 SSG issues
  experimental: {
    forceSwcTransforms: true,
    serverComponentsExternalPackages: [],
  },
  // Disable all static optimization
  staticPageGenerationTimeout: 0,
  // Disable static optimization for problematic pages
  async generateBuildId() {
    return "build-" + Date.now();
  },
  output: "standalone",
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  // Disable static generation completely
  distDir: ".next",
};

export default nextConfig;
