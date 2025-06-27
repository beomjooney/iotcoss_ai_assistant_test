const nextConfig = {
  // SWC 컴파일러 최적화 (Next.js 12.2+에서 최상위 레벨로 이동)
  swcMinify: true,

  // 개발 서버 성능 최적화
  experimental: {
    // Fast Refresh 최적화
    optimizeCss: false, // 개발 중에는 CSS 최적화 비활성화
    // 메모리 사용량 최적화
    workerThreads: false,
    // 빌드 성능 최적화
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
