import './index.module.scss';
import { CompanySignUpTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { useSessionStore } from '../../../src/store/session';
import jwt_decode from 'jwt-decode';
import { UserInfo } from '../../../src/models/account';

/* eslint-disable-next-line */
interface CompanySignUpPageProps {}

export function CompanySignUpPage(props: CompanySignUpPageProps) {
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

  return <CompanySignUpTemplate onSubmitLogin={onSubmitLogin} />;
}

export default CompanySignUpPage;

CompanySignUpPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};

// export async function getServerSideProps(ctx: NextPageContext) {
//   console.log(ctx);
// }
