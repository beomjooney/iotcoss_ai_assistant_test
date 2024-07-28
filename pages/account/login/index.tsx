import './index.module.scss';
import { LoginTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { useSessionStore } from '../../../src/store/session';
import jwt_decode from 'jwt-decode';
import { UserInfo } from '../../../src/models/account';

/* eslint-disable-next-line */
interface LoginPageProps {}

export function LoginPage(props: LoginPageProps) {
  const router = useRouter();
  const token = router.query['token'];

  useEffect(() => {
    token && authUpdate();
  }, [token]);

  const authUpdate = async () => {
    const { update } = useSessionStore.getState();
    const userData: UserInfo = jwt_decode(String(token));

    update({
      logged: userData.sub !== 'Guest',
      memberType: userData.sub,
      memberId: userData.sub,
      memberName: userData.nickname,
      roles: userData.roles,
      token: token,
    });

    setCookie('access_token', router.query['token']);
    // router.query['token'] && window.history.replaceState(null, '', '/account/login');
    // await router.push('/');
    location.href = '/';
  };

  const authLoginUpdate = async () => {
    const { update } = useSessionStore.getState();
    const userData: UserInfo = jwt_decode(String(getCookie('access_token')));
    console.log('userData', userData);
    update({
      logged: userData.sub !== 'Guest',
      memberType: userData.sub,
      memberId: userData.sub,
      memberName: userData.nickname,
      roles: userData.roles,
      token: token,
    });

    // const authStore = localStorage.getItem('auth-store');

    // // JSON 객체를 문자열로 변환하고 URL 인코딩
    // const jsonString = JSON.stringify(authStore);
    // const encodedJson = encodeURIComponent(jsonString);

    // console.log(String(getCookie('access_token')));
    // console.log(authStore);

    // console.log('token', accessToken);
    // // 쿼리 파라미터를 포함한 URL을 생성
    // const _url = {
    //   pathname: url,
    //   query: {
    //     accessToken: token,
    //     authStore: encodedJson,
    //   },
    // };

    // location.href = url + `?accessToken=${accessToken}&authStore=${encodedJson}`;
    // router.push(_url, url).catch(err => console.error('Router push error:', err));
  };

  const onSubmitLogin = async () => {
    authLoginUpdate();
  };

  return <LoginTemplate onSubmitLogin={onSubmitLogin} title="" tenantName="" />;
}

export default LoginPage;

LoginPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
