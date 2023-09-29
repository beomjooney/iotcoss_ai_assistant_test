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
  console.log(token);

  useEffect(() => {
    token && authUpdate();
  }, [token]);

  const authUpdate = async () => {
    const { update } = useSessionStore.getState();
    const userData: UserInfo = jwt_decode(String(token));
    console.log(userData);

    update({
      logged: userData.sub !== 'Guest',
      memberType: userData.sub,
      memberId: userData.sub,
      memberName: userData.nickname,
      roles: userData.roles,
      job: userData.sub,
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
      job: userData.sub,
      roles: userData.roles,
      token: token,
    });

    location.href = '/';
  };

  const onSubmitLogin = async () => {
    console.log('submit');
    authLoginUpdate();
  };

  return <LoginTemplate onSubmitLogin={onSubmitLogin} />;
}

export default LoginPage;

LoginPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};

// export async function getServerSideProps(ctx: NextPageContext) {
//   console.log(ctx);
// }
