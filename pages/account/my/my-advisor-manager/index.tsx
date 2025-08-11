import { MyTemplate, MyAdvisorManagerTemplate } from 'src/templates';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../src/store/session';
import { useStore } from '../../../../src/store';

export interface MyAdvisorManagerPageProps {
  error: boolean;
}

export function MyAdvisorManagerPage({ error }: MyAdvisorManagerPageProps) {
  const { logged, memberId } = useSessionStore.getState();
  const { user } = useStore(); // 성장 스토리 수정 시 무조건 업데이트 한다는 전제하에 가져옴
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
          <MyAdvisorManagerTemplate />
        </MyTemplate>
      )}
    </>
  );
}

export default MyAdvisorManagerPage;

MyAdvisorManagerPage.LayoutProps = {
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
