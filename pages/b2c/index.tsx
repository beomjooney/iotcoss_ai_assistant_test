import './index.module.scss';
import { HomeB2cTemplate } from '../../src/templates/HomeB2c';
import { useSessionStore } from '../../src/store/session';
import { useMemberInfo, useMyProfile } from '../../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useColorPresets, useColorPresetName } from 'src/utils/use-theme-color';
import { usePresets } from 'src/utils/color-presets';
import { useEffect } from 'react';

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
    <div className="tw-h-[1400px]">
      <HomeB2cTemplate logged={logged} tenantName="b2b" />
    </div>
  );
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '데브어스',
};
