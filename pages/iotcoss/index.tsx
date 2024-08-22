import './index.module.scss';
import { HomeSejongTemplate } from '../../src/templates/HomeSeJong';
import { useMemberInfo, useMyProfile } from '../../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useColorPresets, useColorPresetName } from 'src/utils/use-theme-color';
import { usePresets } from 'src/utils/color-presets';
import { useEffect } from 'react';
import { Session, useSessionStore } from '../../src/store/session';
import { GetServerSideProps } from 'next';

export function IndexPage({ session, setActiveIndex }: { session: Session; setActiveIndex: (index: number) => void }) {
  // redirection 처리
  const { update } = useSessionStore.getState();
  useEffect(() => {
    // session이 존재하는 경우에만 상태 업데이트를 수행
    if (session) {
      update(session);
    }
  }, [session, update]); // 의존성 배열에 session과 update 포함

  const COLOR_PRESETS = usePresets();
  const { setColorPresetName } = useColorPresetName();
  const { setColorPresets } = useColorPresets();

  const { memberId, logged } = useSessionStore(state => ({
    memberId: state.memberId,
    name: state.name,
    logged: state.logged,
  }));

  // session이 존재하는 경우에만 상태 업데이트를 수행
  useEffect(() => {
    if (session) {
      update(session);
    }
  }, [session, update]);

  // 색상 설정
  useEffect(() => {
    if (!COLOR_PRESETS || COLOR_PRESETS.length === 0) return;
    const preset = COLOR_PRESETS.find(preset => preset.name === 'iotcoss') || COLOR_PRESETS[0];
    setColorPresetName(preset.name);
    setColorPresets(preset.colors);
  }, []);

  const { setUser } = useStore();
  const { data } = useMemberInfo(memberId, data => {
    console.log('useMemberInfo', data);
    setUser({ user: data });
  });

  useEffect(() => {
    console.log('setActiveIndex');
    localStorage.setItem('activeIndex', '0');
    setActiveIndex(0);
  }, []);

  // TODO 로그인 수정 변경
  return (
    <div className="tw-h-[2500px]">
      <HomeSejongTemplate logged={logged} tenantName="sejong" />
    </div>
  );
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '데브어스',
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { authStore } = context.query;
    let session: Session | null = null;

    if (authStore) {
      console.log('authStore', authStore);
      const authData = authStore;

      console.log('authData', authData);
      // 2. Base64 디코딩 (Node.js 환경에서는 Buffer를 사용)
      const decodedAuthStore = Buffer.from(authData, 'base64').toString('utf-8');
      console.log('parsedAuthStore', decodedAuthStore);
      session = JSON.parse(decodedAuthStore);
      console.log('session', session);
    } else {
      console.log('No authStore provided');
    }

    return {
      props: { session },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
};
