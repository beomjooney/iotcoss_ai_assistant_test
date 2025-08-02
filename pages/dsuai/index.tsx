import './index.module.scss';
import { HomeDsuAiTemplate } from '../../src/templates/HomeDsuAi';
import { useMemberInfo } from '../../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useEffect, useState } from 'react';
import { Session, useSessionStore } from '../../src/store/session';

import { GetServerSideProps } from 'next';

export function IndexPage({ session, setActiveIndex }: { session: Session; setActiveIndex: (index: number) => void }) {
  const [isClient, setIsClient] = useState(false);
  const [logged, setLogged] = useState(false);
  const [memberId, setMemberId] = useState<string>('');

  // 세션 스토어 업데이트
  const { update } = useSessionStore.getState();

  useEffect(() => {
    setIsClient(true);

    // 클라이언트에서만 실행되는 로직
    if (typeof window !== 'undefined') {
      // session이 존재하는 경우에만 상태 업데이트를 수행
      if (session) {
        update(session);
      }

      // 세션 스토어에서 로그인 상태와 멤버 ID 가져오기
      const { logged: sessionLogged, memberId: sessionMemberId } = useSessionStore.getState();
      setLogged(sessionLogged);
      setMemberId(sessionMemberId || '');

      // localStorage 접근
      localStorage.setItem('activeIndex', '0');
      if (setActiveIndex) {
        setActiveIndex(0);
      }
    }
  }, [session, update, setActiveIndex]);

  const { setUser } = useStore();
  const { data } = useMemberInfo(memberId, data => {
    console.log('useMemberInfo', data);
    setUser({ user: data });
  });

  // 클라이언트 렌더링이 준비되지 않았으면 기본 UI 표시
  if (!isClient) {
    return (
      <div className="">
        <HomeDsuAiTemplate logged={false} tenantName="dsuai" />
      </div>
    );
  }

  return (
    <div className="">
      <HomeDsuAiTemplate logged={logged} tenantName="dsuai" />
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
    const { query } = context;
    const { authStore } = query;
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
