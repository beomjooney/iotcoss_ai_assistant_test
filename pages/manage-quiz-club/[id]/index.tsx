import './index.module.scss';
import { ManageQuizClubTemplate } from 'src/templates';
import { useSessionStore } from 'src/store/session';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { dehydrate } from 'react-query';
import { fetchSeminar } from '../../../src/services/seminars/seminars.queries';

export function QuizManagePage() {
  const router = useRouter();
  const id = router.query['id'].toString();

  return <ManageQuizClubTemplate id={id} title="퀴즈클럽 관리하기" subtitle={true} />;
}

export default QuizManagePage;

QuizManagePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};

export async function getServerSideProps(ctx: NextPageContext) {
  const { memberId, logged } = useSessionStore.getState();
  const { query } = ctx;
  let queryClient = await fetchSeminar(String(query));
  queryClient.setQueryData('logged', logged);
  return {
    props: { ...query, dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))) },
  };
}
