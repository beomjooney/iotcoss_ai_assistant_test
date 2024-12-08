import { MyTemplate, GrowthStoryAdminTemplate } from 'src/templates';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../src/store/session';
import { useStore } from '../../../../src/store';
import { useMentor } from 'src/services/mentors/mentors.queries';

export interface GrowthStoryAdminPageProps {
  error: boolean;
}

export function GrowthStoryAdminPage({ error }: GrowthStoryAdminPageProps) {
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
        <MyTemplate>
          <GrowthStoryAdminTemplate hasInfoData={''} userType={user?.type} />
        </MyTemplate>
      )}
    </>
  );
}

export default GrowthStoryAdminPage;

GrowthStoryAdminPage.LayoutProps = {
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
