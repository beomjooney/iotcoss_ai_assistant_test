import './index.module.scss';
import { BlogTemplate } from '../../src/templates';
import { useSessionStore } from '../../src/store/session';
import { useMemberInfo, useMyProfile } from '../../src/services/account/account.queries';
import { useStore } from 'src/store';

export function IndexPage() {
  const { memberId, logged } = useSessionStore(state => ({
    memberId: state.memberId,
    name: state.name,
    logged: state.logged,
  }));

  const { setUser } = useStore();
  const { data } = useMemberInfo(memberId, data => {
    console.log('useMemberInfo', data);
    setUser({ user: data });
  });

  // TODO 로그인 수정 변경
  return (
    <div className="">
      <BlogTemplate logged={logged} tenantName="dsu" />
    </div>
  );
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '데브어스',
};
