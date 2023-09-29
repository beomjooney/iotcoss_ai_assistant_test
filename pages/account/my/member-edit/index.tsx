import './index.module.scss';
import { MyTemplate, MemberEditTemplate, GrowthStoryTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSessionStore } from '../../../../src/store/session';

export interface MemberEditPageProps {
  error: boolean;
}

export function MemberEditPage({ error }: MemberEditPageProps) {
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
          <MemberEditTemplate />
        </MyTemplate>
      )}
    </>
  );
}

export default MemberEditPage;

MemberEditPage.LayoutProps = {
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
