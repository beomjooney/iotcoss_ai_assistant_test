import './index.module.scss';
import { MentoringDetailTemplate } from 'src/templates';
import { dehydrate, UseQueryResult } from 'react-query';
import { fetchMentor, useMentorUri } from '../../../src/services/mentors/mentors.queries';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useSeminarList } from '../../../src/services/seminars/seminars.queries';

export function MentoringDetailPage() {
  const router = useRouter();
  const id = router.query['id'].toString();
  const { data: mentorData, isLoading }: UseQueryResult<any> = useMentorUri(id);
  const { data: seminarData, isLoading: seminarDataLoading }: UseQueryResult<any> = useSeminarList({
    lecturerMemberId: mentorData?.memberId,
  });

  return (
    <>
      {isLoading || seminarDataLoading ? (
        <span>Loading...</span>
      ) : (
        <MentoringDetailTemplate mentorData={mentorData} seminarData={seminarData} />
      )}
    </>
  );
}

export default MentoringDetailPage;

MentoringDetailPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const queryClient = await fetchMentor(String(query));
  return {
    props: { ...query, dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))) },
  };
}
