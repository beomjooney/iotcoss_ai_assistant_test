import localFont from 'next/font/local';

export const bebas = localFont({
  src: '../static/fonts/BebasNeue.woff',
  variable: '--font-bebas',
});

export const pretendard = localFont({
  src: [
    {
      path: '/assets/fonts/NotoSans-Medium.woff',
      weight: '400',
    },
  ],
  variable: '--font-pretendard',
});
