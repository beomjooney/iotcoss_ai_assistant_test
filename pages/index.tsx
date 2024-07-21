import './index.module.scss';
import { HomeTemplate } from '../src/templates';
import { HomeSejongTemplate } from '../src/templates/HomeSeJong';
import { useSessionStore } from '../src/store/session';
import { useMemberInfo, useMyProfile } from '../src/services/account/account.queries';
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
    if (myProfileData) {
      const tenantName = myProfileData?.tenant?.tenantName;
      switch (tenantName) {
        case 'devus':
          setColorPresetName('blue');
          setColorPresets(COLOR_PRESETS[0].colors);
          break;
        case 'sejong':
          setColorPresetName('black');
          setColorPresets(COLOR_PRESETS[1].colors);
          break;
        case 'example':
          setColorPresetName('teal');
          setColorPresets(COLOR_PRESETS[2].colors);
          break;
        default:
          setColorPresetName('blue');
          setColorPresets(COLOR_PRESETS[0].colors);
          break;
      }
    }
  }, [myProfileData]);

  const renderTemplate = () => {
    const tenantName = myProfileData?.tenant?.tenantName;
    switch (tenantName) {
      case 'devus':
      case null:
      case 'example':
        return <HomeTemplate logged={logged} />;
      case 'sejong':
        return <HomeSejongTemplate logged={logged} />;
      default:
        return null;
    }
  };

  // TODO 로그인 수정 변경
  return <div>{renderTemplate()}</div>;
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '데브어스',
};
