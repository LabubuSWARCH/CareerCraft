/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

module.exports = nextConfig;
