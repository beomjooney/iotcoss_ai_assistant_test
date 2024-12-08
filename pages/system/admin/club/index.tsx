import { AdminTemplate, AdminClubTemplate } from 'src/templates';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../src/store/session';
import { useStore } from '../../../../src/store';
import { useMentor } from '../../../../src/services/mentors/mentors.queries';

export interface GrowthStoryPageProps {
  error: boolean;
}

export function MyActivityPage({ error }: GrowthStoryPageProps) {
  const { logged, memberId } = useSessionStore.getState();
  const { user } = useStore(); // 성장 스토리 수정 시 무조건 업데이트 한다는 전제하에 가져옴
  // const { data: userResumeStory } = useMentor(logged ? memberId : null);
  const router = useRouter();
  useEffect(() => {
    if (!logged || error) {
      alert('비정상적인 접근입니다.');
      window.location.href = '/';
    }
  }, [error]);

  return (
    <>
      {!error && (
        <AdminTemplate>
          <AdminClubTemplate />
        </AdminTemplate>
      )}
    </>
  );
}

export default MyActivityPage;

MyActivityPage.LayoutProps = {
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
