import '../public/assets/css/materialdesignicons.min.css';
import '../public/Apps.scss';
import '../public/assets/css/colors/default.css';

import '../public/assets/css/admin/style.css';
import 'public/assets/css/themify-icons.css';
import 'public/assets/css/bootstrap.min.css';
import 'public/assets/css/style.css';
import 'public/assets/css/responsive.css';
import 'public/assets/css/diagram.css';
import '../public/globals.css';

import Head from 'next/head';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { DefaultLayout } from '../src/stories/Layout';
import { ComponentType, useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { axiosSetHeader } from '../src/services';
import { getCookie, setCookie } from 'cookies-next';
import { AppContext, AppProps } from 'next/app';
import { NextPage } from 'next';
import { AuthError, ForbiddenError, NotFoundError } from '../src/services/error';
import { Session, useSessionStore } from '../src/store/session';
import jwt_decode from 'jwt-decode';
import { UserInfo } from '../src/models/account';

/** import gtag */
import * as gtag from 'src/lib/gtag';
import Script from 'next/script';
import { useRouter } from 'next/router';

export type NextPageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  Layout: ComponentType;
  LayoutProps: any;
};

export type AppPropsWithLayout<P = Record<string, unknown>> = AppProps<P> & {
  Component: NextPageWithLayout<P>;
  session?: Session;
};

function CustomApp({ Component, pageProps = {}, session }: AppPropsWithLayout) {
  const { update, memberId, job, memberType, token, logged } = useSessionStore.getState();
  const accessToken = getCookie('access_token');
  if (!accessToken && accessToken === '') {
    update({
      token: process.env['NEXT_PUBLIC_GUEST_TOKEN'],
      memberType: 'Guest',
      memberId: undefined,
      memberName: undefined,
      logged: false,
      roles: [],
    });
  }

  if (token) {
    setCookie('access_token', token);
  }

  if (session && session.memberType !== memberType) {
    update(session);
  }

  const [queryClient] = useState(() => new QueryClient());
  const Layout = Component.Layout ?? DefaultLayout;
  const LayoutProps = Component.LayoutProps ?? {};

  /**gtag */
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Head>
        <title>데브어스</title>
        <meta name="description" content="데브어스" />
        <meta name="keywords" content="데브어스, devus" />
        <meta name="application-name" content="데브어스" />
        <meta name="application-mobile-web-app-title" content="데브어스" />
        {/* <meta name="viewport" content="width=1200" /> */}
        <link rel="shortcut icon" href="#" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/favicon-16x16.png" />
        {/* <script src="https://js.bootpay.co.kr/bootpay-4.2.6.min.js" type="application/javascript"></script> */}
        {/* Global Site Tag (gtag.js) - Google Analytics */}
      </Head>
      <main className="app">
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Layout {...LayoutProps}>
              <Component {...pageProps} />
            </Layout>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </main>
    </>
  );
}
export default CustomApp;

CustomApp.getStaticProps = async ({ Component, ctx }: AppContext) => {
  let pageProps: Record<string, any> = {};
  let userAgent: string;
  let currentUrl: string;
  let session: Session;

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const { req, res } = ctx;

  if (req) {
    const { headers, url } = req;
    const accessToken = String(getCookie('access_token', { req }));
    const cookie = headers.cookie || '';

    currentUrl = url;
    userAgent = headers['user-agent'];
    axiosSetHeader(accessToken, userAgent, cookie);
  } else {
    currentUrl = ctx.asPath;
    userAgent = navigator.userAgent;
  }

  try {
    const token = String(getCookie('access_token'));
    let userData: UserInfo;
    if (token) {
      userData = jwt_decode(token);
    }

    session = {
      logged: userData.sub !== 'Guest',
      memberType: userData.sub,
      memberId: userData.sub,
      memberName: userData.nickname,
      userAgent: userAgent,
    };
  } catch (error) {
    const { message, redirectUrl } = error;
    if (error instanceof AuthError) {
      const location = `${redirectUrl}?redirect_url=${encodeURIComponent(`/${currentUrl}`)}`;
      if (res) {
        res && res.writeHead(302, { Location: location }).end();
      } else {
        if (typeof window !== 'undefined') {
          alert(message);
          (window as Window).location = location;
          await new Promise(resolve => {
            //페이지 이동 전 렌더링 방지
          });
        }
      }
    }
    if (error instanceof NotFoundError) {
      if (res) {
        res.statusCode = 404;
        res.statusMessage = `Invalid API Path : ${error.path}`;
      } else {
        if (typeof window !== 'undefined') {
          alert(message);
        }
      }
    }
    if (error instanceof ForbiddenError) {
      if (res) {
        res.statusCode = 403;
        res.statusMessage = `Invalid API Path : ${error.message}`;
      } else {
        if (typeof window !== 'undefined') {
          alert(message);
        }
      }
    }
  }

  return { ...pageProps, session };
};
