import { MyTemplate, MyFriendsTemplate } from 'src/templates';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../src/store/session';
import { useStore } from '../../../../src/store';
import { useMentor } from '../../../../src/services/mentors/mentors.queries';

export interface GrowthStoryPageProps {
  error: boolean;
}

export function MyFriendsPage({ error }: GrowthStoryPageProps) {
  const { logged, memberId } = useSessionStore.getState();
  const router = useRouter();
  useEffect(() => {
    if (!logged || error) {
      alert('비정상적인 접근입니다.');
      router.push('/');
    }
  }, [error]);

  return (
    <>
      {!error && (
        <MyTemplate>
          <MyFriendsTemplate />
        </MyTemplate>
      )}
    </>
  );
}

export default MyFriendsPage;

MyFriendsPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};

export async function getServerSideProps({ req }) {
  if (!req.headers.referer) {
    return { props: { error: true } };
  }
  return { props: { error: false } };
}
