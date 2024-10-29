import './index.module.scss';
import { HomeTemplate } from '../../src/templates';
import { useMemberInfo, useMyProfile } from '../../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useEffect } from 'react';
import { Session, useSessionStore } from '../../src/store/session';

import { GetServerSideProps } from 'next';
import { fetchGuestTenats, useGuestTenant } from '../../src/services/seminars/seminars.queries';
import { dehydrate, useQuery } from 'react-query';
import { setCookie } from 'cookies-next';

export function IndexPage({ session, setActiveIndex }: { session: Session; setActiveIndex: (index: number) => void }) {
  // redirection 처리
  const { update, logged, memberId } = useSessionStore.getState();
  useEffect(() => {
    // session이 존재하는 경우에만 상태 업데이트를 수행
    if (session) {
      update(session);
    }
  }, [session, update]); // 의존성 배열에 session과 update 포함

  // console.log('memberId', logged, memberId);
  const { setUser } = useStore();
  const { data } = useMemberInfo(memberId, data => {
    console.log('useMemberInfo', data);
    setUser({ user: data });
  });

  //미로그인 데이터 처리
  // if (!logged) {
  //   useGuestTenant('dsu', data => {
  //     setCookie('access_token', data.guestToken);
  //     console.log('access_token', data.guestToken);
  //     update({
  //       tenantName: data.tenantName,
  //       redirections: data.homeUrl,
  //       menu: {
  //         use_lecture_club: data.lectureClubUseYn === 'YES' ? true : false,
  //         use_quiz_club: data.quizClubUseYn === 'YES' ? true : false,
  //       },
  //     });
  //   });
  // }

  useEffect(() => {
    localStorage.setItem('activeIndex', '0');
    setActiveIndex(0);
  }, []);

  // TODO 로그인 수정 변경
  return (
    <div className="tw-h-[1400px]">
      <HomeTemplate logged={logged} tenantName="dsu" />
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
      console.log('authStore', authStore);
      const authData = authStore;

      console.log('authData', authData);
      // 2. Base64 디코딩 (Node.js 환경에서는 Buffer를 사용)
      const decodedAuthStore = Buffer.from(authData, 'base64').toString('utf-8');
      console.log('parsedAuthStore', decodedAuthStore);
      session = JSON.parse(decodedAuthStore);
      console.log('session', session);
    } else {
      // let queryClient = await fetchGuestTenats('dsu');
      // return {
      //   props: { ...query, dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))) },
      // };
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
