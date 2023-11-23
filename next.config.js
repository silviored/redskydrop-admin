/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.im.ge',
      },
      {
        protocol: 'https',
        hostname: 'red-sky-drop.s3.sa-east-1.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
