/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/stories',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/stories/:slug',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
