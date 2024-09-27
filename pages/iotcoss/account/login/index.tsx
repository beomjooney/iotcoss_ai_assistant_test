import './index.module.scss';
import { LoginOneTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { useSessionStore } from '../../../../src/store/session';
import jwt_decode from 'jwt-decode';
import { UserInfo } from '../../../../src/models/account';

import { useColorPresets, useColorPresetName } from 'src/utils/use-theme-color';
import { usePresets } from 'src/utils/color-presets';

/* eslint-disable-next-line */
interface LoginPageProps {}

export function LoginPage(props: LoginPageProps) {
  // const COLOR_PRESETS = usePresets();
  // const { setColorPresetName } = useColorPresetName();
  // const { setColorPresets } = useColorPresets();

  // setColorPresetName('blue');
  // setColorPresets(COLOR_PRESETS[0].colors);

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
      token: String(getCookie('access_token')),
    });

    setCookie('access_token', router.query['token']);
    // router.query['token'] && window.history.replaceState(null, '', '/account/login');
    // await router.push('/');
    location.href = '/';
  };

  const authLoginUpdate = async () => {
    const { update } = useSessionStore.getState();
    const userData: UserInfo = jwt_decode(String(getCookie('access_token')));

    update({
      logged: userData.sub !== 'Guest',
      memberType: userData.sub,
      memberId: userData.sub,
      memberName: userData.nickname,
      roles: userData.roles,
      token: token,
    });

    // location.href = '/';
  };

  const onSubmitLogin = async () => {
    authLoginUpdate();
  };

  return <LoginOneTemplate title="" onSubmitLogin={onSubmitLogin} />;
}

export default LoginPage;

LoginPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
