import './index.module.scss';
import { HomeTemplate } from '../../src/templates';
import { HomeSejongTemplate } from '../../src/templates/HomeSeJong';
import { useSessionStore } from '../../src/store/session';
import { useMemberInfo, useMyProfile } from '../../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useColorPresets, useColorPresetName } from 'src/utils/use-theme-color';
import { usePresets } from 'src/utils/color-presets';
import { useEffect } from 'react';

export function IndexPage() {
  const COLOR_PRESETS = usePresets();
  const { setColorPresetName } = useColorPresetName();
  const { setColorPresets } = useColorPresets();
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

  const { data: myProfileData } = useMyProfile(data => {
    console.log('useMyProfile : ', data);
  });

  useEffect(() => {
    if (!COLOR_PRESETS || COLOR_PRESETS.length === 0) return;

    const preset = COLOR_PRESETS.find(preset => preset.name === 'sejong') || COLOR_PRESETS[0];
    setColorPresetName(preset.name);
    setColorPresets(preset.colors);
  }, []);

  // TODO 로그인 수정 변경
  return (
    <div className="tw-h-[1400px]">
      <HomeSejongTemplate logged={logged} />
    </div>
  );
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '데브어스',
};
