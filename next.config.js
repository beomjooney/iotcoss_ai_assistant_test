const nextConfig = {
  // images: {
  //   loader: 'imgix',
  //   path: 'https://camen.co.kr:9000/career-mentors',
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['camen.co.kr', 'careermentors.co.kr', 'k.kakaocdn.net', 'lifementors.co.kr', '3.39.99.82'],
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
};

module.exports = nextConfig;
