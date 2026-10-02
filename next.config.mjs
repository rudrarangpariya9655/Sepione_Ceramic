const nextConfig = {
  turbopack: { root: process.cwd() },
  redirects() {
    return [
      { source: '/tiles/12x12', destination: '/tiles/300x300', permanent: true },
      { source: '/tiles/16x16', destination: '/tiles/400x400', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
