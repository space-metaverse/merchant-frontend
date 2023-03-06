/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'flagcdn.com',
      'space-staging-assets.metaverse-demo.com',
      'tryspace-prod-assets.tryspace-internal.com'
    ],
  },
}

module.exports = nextConfig
