const nextConfig = {
  // compiler: {
  //   removeConsole: false,
  // },
  // images: {
  //   loader: 'imgix',
  //   path: 'https://camen.co.kr:9000/career-mentors',
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['devus.co.kr', 'k.kakaocdn.net', '3.39.99.82', 'dsu.localhost', 'localhost'],
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
};

if (process.env.NEXT_PUBLIC_NODE_ENV === 'prod') {
  nextConfig.compiler = {
    removeConsole: true,
  };
}

module.exports = nextConfig;
