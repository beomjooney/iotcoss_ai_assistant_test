import { MyTemplate, MyMentorPickTemplate } from 'src/templates';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSessionStore } from '../../../../src/store/session';

export interface MyMentorPageProps {
  error: boolean;
}

export function MyMentorPage({ error }: MyMentorPageProps) {
  const { logged } = useSessionStore.getState();
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
          <MyMentorPickTemplate />
        </MyTemplate>
      )}
    </>
  );
}

export default MyMentorPage;

MyMentorPage.LayoutProps = {
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
