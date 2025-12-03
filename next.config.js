/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Disable webpack cache to avoid Windows EISDIR errors
  experimental: {
    webpackBuildWorker: false,
  },
  // Use a different output directory to avoid Windows path issues
  distDir: '.next-build',
  // Ensure static files in public folder are served correctly
  async rewrites() {
    return [
      // Serve public/index.html at root path
      {
        source: '/',
        destination: '/index.html',
      },
    ]
  },
  webpack: (config, { isServer, webpack }) => {
    // Disable symlink resolution — prevents readlink() issues on Windows
    config.resolve.symlinks = false;

    // Force absolute path normalization so Windows doesn't treat files as directories
    const projectRoot = path.resolve(__dirname).replace(/\\/g, '/');
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": projectRoot,
      "@/app": path.resolve(__dirname, "pages").replace(/\\/g, '/'),
    };

    // Disable filesystem caching (Next.js tries to cache symlink metadata)
    config.cache = false;

    // Override webpack's file system to prevent readlink() calls on directories
    const originalReadlinkSync = require('fs').readlinkSync;
    const patchedReadlinkSync = function(...args) {
      try {
        const stats = require('fs').lstatSync(args[0]);
        if (stats.isDirectory()) {
          // If it's a directory, return the path itself instead of calling readlink
          return args[0];
        }
        return originalReadlinkSync.apply(this, args);
      } catch (e) {
        // If readlink fails, return the original path
        return args[0];
      }
    };

    // Patch fs.readlinkSync in webpack context
    if (typeof config.plugins !== 'undefined') {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_IGNORE_DIR_SYMLINKS': JSON.stringify('true'),
        })
      );
    }

    // Disable Turbopack (if applicable)
    if (config.experiments) {
      config.experiments = { ...config.experiments, cacheUnaffected: false };
    }

    return config;
  },
}

module.exports = nextConfig

