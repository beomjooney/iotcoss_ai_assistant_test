import './index.module.scss';
import { SignupAuthenticationTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { useSessionStore } from '../../../src/store/session';
import jwt_decode from 'jwt-decode';
import { UserInfo } from '../../../src/models/account';

/* eslint-disable-next-line */
interface SignupAuthenticationTemplate {}

export function SignupAuthenticationPage(props: SignupAuthenticationTemplate) {
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

  const onSubmitLogin = async () => {
    // TODO: 로그인 로직 구현
  };

  return <SignupAuthenticationTemplate onSubmitLogin={onSubmitLogin} />;
}

export default SignupAuthenticationPage;

SignupAuthenticationPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',

  title: '데브어스',
};
