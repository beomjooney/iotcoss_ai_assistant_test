import './index.module.scss';
import { SignUpTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { useSessionStore } from '../../../src/store/session';
import jwt_decode from 'jwt-decode';
import { UserInfo } from '../../../src/models/account';

/* eslint-disable-next-line */
interface SignUpPageProps {}

export function SignUpPage(props: SignUpPageProps) {
  const router = useRouter();
  const token = router.query['token'];

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
      token: token,
    });

    setCookie('access_token', router.query['token']);
    // router.query['token'] && window.history.replaceState(null, '', '/account/login');
    // await router.push('/');
    location.href = '/';
  };

  const onSubmitLogin = async () => {
    console.log('submit');
  };

  return <SignUpTemplate onSubmitLogin={onSubmitLogin} />;
}

export default SignUpPage;

SignUpPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};

// export async function getServerSideProps(ctx: NextPageContext) {
//   console.log(ctx);
// }
