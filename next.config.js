const nextConfig = {
  // SWC 컴파일러 최적화 (Next.js 12.2+에서 최상위 레벨로 이동)
  swcMinify: true,

  // 개발 서버 성능 최적화
  experimental: {
    // Next.js 12.2.5에서 지원하는 실험적 기능들만 사용
    esmExternals: true,
  },

  // webpack 설정 최적화
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (dev) {
      // 개발 모드에서 최적화
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };

      // 개발 서버 HMR 최적화
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },

  // compiler: {
  //   removeConsole: true,
  // },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn', 'info'],
          }
        : false,
  },
  typescript: {
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

module.exports = nextConfig;
