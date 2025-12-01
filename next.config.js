/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  // Disable webpack cache to avoid Windows EISDIR errors
  experimental: {
    webpackBuildWorker: false,
  },
  // Use a different output directory to avoid Windows path issues
  distDir: '.next-build',
  // Ensure static files in public folder are served correctly
  async rewrites() {
    return []
  },
  webpack: (config, { isServer, webpack }) => {
    // Disable Windows symlink resolution bugs
    config.resolve.symlinks = false;
    
    // Completely disable webpack caching to avoid EISDIR errors on Windows
    // This is a workaround for Windows filesystem issues with Next.js
    config.cache = {
      type: 'memory', // Use in-memory cache instead of filesystem
    };
    
    // Normalize paths to avoid Windows path issues
    const projectRoot = path.resolve(__dirname);
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": projectRoot,
    };
    
    // Disable problematic optimizations on Windows
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false, // Temporarily disable to isolate issue
      };
    }
    
    return config;
  },
}

module.exports = nextConfig

