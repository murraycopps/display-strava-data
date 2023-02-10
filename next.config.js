/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https:',
        host: 'dgalywyr863hv.cloudfront.net',
        port: '',
        pathname: '/pictures/athletes/*/*/*/*',
      }


  },
}

module.exports = nextConfig
