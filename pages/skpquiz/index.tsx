import './index.module.scss';
import { HomeSkpQuizTemplate } from '../../src/templates/HomeSkpQuiz';
import { useMemberInfo } from '../../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useEffect, useState } from 'react';
import { Session, useSessionStore } from '../../src/store/session';

import { GetServerSideProps } from 'next';

export function IndexPage({ session, setActiveIndex }: { session: Session; setActiveIndex: (index: number) => void }) {
  const { update, logged, memberId, tenantName } = useSessionStore.getState();

  useEffect(() => {
    if (session) {
      update(session);
    }
  }, [session, update]);

  const { setUser } = useStore();
  const { data } = useMemberInfo(memberId, data => {
    console.log('useMemberInfo', data);
    setUser({ user: data });
  });

  useEffect(() => {
    localStorage.setItem('activeIndex', '0');
    setActiveIndex(0);
  }, []);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render after component is mounted to avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <div className="tw-h-[1981px]">
      <HomeSkpQuizTemplate logged={logged} tenantName="quizup" />
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
    const { authStore } = context.query;
    let session: Session | null = null;

    if (authStore) {
      const authData = authStore;
      const decodedAuthStore = Buffer.from(authData, 'base64').toString('utf-8');
      session = JSON.parse(decodedAuthStore);
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
