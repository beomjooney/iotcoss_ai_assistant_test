import './index.module.scss';
import { MentoringRegisterTemplate } from 'src/templates';
import { UseQueryResult } from 'react-query';
import { useExperiences } from '../../../src/services/experiences/experiences.queries';
import { ExperiencesResponse } from '../../../src/models/experiences';
import { useSkills } from '../../../src/services/skill/skill.queries';
import { SkillResponse } from '../../../src/models/skills';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useJobs } from '../../../src/services/jobs/jobs.queries';
import { useSaveMentor } from '../../../src/services/mentors/mentors.mutations';
import { useSessionStore } from '../../../src/store/session';
import { useStore } from '../../../src/store';
import { useMentor } from '../../../src/services/mentors/mentors.queries';

export interface MentoringRegisterProps {
  error: boolean;
}

export function MentoringRegisterPage({ error }: MentoringRegisterProps) {
  const router = useRouter();
  const prevPath = router.query['prevPath'];
  const type = router.query['type'] as string;
  const { user, setHasResumeStory } = useStore();
  const { memberId, logged } = useSessionStore.getState();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: jobsData, refetch: jobsRefetch }: UseQueryResult<any> = useJobs();
  const { mutate: onSaveMentor, isSuccess, isError } = useSaveMentor();

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
    onSaveMentor({
      ...params,
      memberId: memberId,
      type: type,
    });
    setHasResumeStory(true);
  };

  if (isSuccess) {
    router.push('/mentoring');
  }

  return (
    <>
      {!error && (
        <MentoringRegisterTemplate
          experiences={experienceData}
          skills={skillData}
          jobs={jobsData}
          onGetJobsData={getJobsList}
          onMentorSubmit={onMentorSubmit}
          type={type}
          userType={user?.type}
        />
      )}
    </>
  );
}

export default MentoringRegisterPage;

MentoringRegisterPage.LayoutProps = {
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
