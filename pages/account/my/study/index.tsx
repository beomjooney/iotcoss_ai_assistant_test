import './index.module.scss';
import { GrowthStoryTemplate, MyTemplate, StudyTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSessionStore } from '../../../../src/store/session';

export interface StudyPageProps {
  error: boolean;
}

export function StudyPage({ error }: StudyPageProps) {
  const { logged } = useSessionStore.getState();
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
          <StudyTemplate />
        </MyTemplate>
      )}
    </>
  );
}

export default StudyPage;

StudyPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};

export async function getServerSideProps({ req }) {
  if (!req.headers.referer) {
    return { props: { error: true } };
  }
  return { props: { error: false } };
}
