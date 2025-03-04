import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // Set to true for a 301 redirect
      },
    ];
  },
};

export default nextConfig;
