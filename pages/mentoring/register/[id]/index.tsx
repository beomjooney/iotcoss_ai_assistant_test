import './index.module.scss';
import { MentoringEditTemplate } from 'src/templates';
import { dehydrate, UseQueryResult } from 'react-query';
import { useExperiences } from '../../../../src/services/experiences/experiences.queries';
import { ExperiencesResponse } from '../../../../src/models/experiences';
import { useSkills } from '../../../../src/services/skill/skill.queries';
import { SkillResponse } from '../../../../src/models/skills';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useJobs } from '../../../../src/services/jobs/jobs.queries';
import { useSaveGrowthStory } from '../../../../src/services/mentors/mentors.mutations';
import { useSessionStore } from '../../../../src/store/session';
import { fetchMentor, useMentor } from '../../../../src/services/mentors/mentors.queries';
import { useStore } from '../../../../src/store';

export interface MentoringEditProps {
  error: boolean;
}

export function MentoringEditPage({ error }: MentoringEditProps) {
  const router = useRouter();
  const prevPath = router.query['prevPath'];
  const type = router.query['type'] as string;
  const id = router.query['id'].toString();
  const { logged } = useSessionStore.getState();
  const { setHasResumeStory } = useStore();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: jobsData, refetch: jobsRefetch }: UseQueryResult<any> = useJobs();
  const { mutate: onSaveGrowthStory, isSuccess, isError } = useSaveGrowthStory();
  // TODO 멘티용 API 따로 생기면 셋팅 필요
  const { data: userInfoData } = useMentor(logged ? id : null, data => setHasResumeStory(!!data));

  useEffect(() => {
    if (error) {
      alert('비정상적인 접근입니다.');
      router.push('/mentoring');
    }
  }, [error]);

  useEffect(() => {
    if (!logged) {
      if (confirm('로그인이 필요한 페이지 입니다.\n로그인 하시겠습니까?')) {
        router.push('/account/login');
        return;
      }
      router.push(prevPath as string);
    }
  }, [logged]);

  const getJobsList = async () => {
    await jobsRefetch();
  };

  const onMentorSubmit = (params: any) => {
    onSaveGrowthStory({
      ...params,
      memberId: id,
      type: type,
    });
  };

  if (isSuccess) {
    router.push('/mentoring');
  }

  return (
    <>
      {!error && (
        <MentoringEditTemplate
          experiences={experienceData}
          skills={skillData}
          jobs={jobsData}
          userInfoData={userInfoData}
          onGetJobsData={getJobsList}
          onMentorSubmit={onMentorSubmit}
        />
      )}
    </>
  );
}

export default MentoringEditPage;

MentoringEditPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};

export async function getServerSideProps({ req, query }) {
  if (!req.headers.referer) {
    return { props: { error: true } };
  }
  const queryClient = await fetchMentor(String(query));
  return { props: { ...query, dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))), error: false } };
}
