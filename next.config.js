/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure static files in public folder are served correctly
  async rewrites() {
    return []
  },
}

module.exports = nextConfig

