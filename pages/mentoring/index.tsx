import './index.module.scss';
import { MentoringTemplate } from 'src/templates';
import { UseQueryResult } from 'react-query';
import { useGetMentorList, useMentor, useRecommendMentors } from '../../src/services/mentors/mentors.queries';
import { useSessionStore } from '../../src/store/session';
import { useState } from 'react';
import { useStore } from '../../src/store';

export function MentoringPage() {
  const { memberId, logged } = useSessionStore.getState();
  const { user } = useStore();

  const [page, setPage] = useState<number>(1);
  const [mentorParams, setMentorParams] = useState<any>({ page: 1, jobGroups: '', levels: '' });
  const [recommendPage, setRecommendPage] = useState<number>(1);
  const [recommendParams, setRecommendParams] = useState<any>({ page: 1, jobGroups: '', levels: '' });

  // 추천 멘토 전체 조회
  const { data: recommendMentors, isLoading: recommendLoading }: UseQueryResult<any> = useRecommendMentors(
    paramsWithDefaultRecommend({
      ...recommendParams,
      memberId,
    }),
  );

  // 전체 멘토 조회
  const { data: mentors, isLoading: mentorsLoading }: UseQueryResult<any> = useGetMentorList(
    paramsWithDefault({
      ...mentorParams,
      page,
    }),
  );

  // 멘토 등록 여부 조회
  const { data: userResumeStory } = useMentor(logged ? memberId : null);

  const onRecommendPage = async (params: any) => {
    setRecommendParams(params);
    setRecommendPage(params.page);
  };

  const onPage = async (params: any) => {
    setRecommendParams(params);
    setMentorParams(params);
    setRecommendPage(params.page);
    setPage(params.page);
  };

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: mentors?.totalPage,
  };

  return (
    <>
      {recommendLoading || mentorsLoading ? (
        <span>Loading...</span>
      ) : (
        <MentoringTemplate
          mentorList={mentors}
          recommendMentorList={recommendMentors}
          onRecommendPage={onRecommendPage}
          onPage={onPage}
          recommendPage={recommendPage}
          recommendParams={recommendParams}
          pageProps={PAGE_PROPS}
          userResumeStory={userResumeStory}
          userType={user?.type}
        />
      )}
    </>
  );
}

export default MentoringPage;

MentoringPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};

const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    page: 1,
    size: 12,
  };
  return {
    ...defaultParams,
    ...params,
  };
};

const paramsWithDefaultRecommend = (params: any) => {
  const defaultParams: any = {
    page: 1,
    size: 4,
  };
  return {
    ...defaultParams,
    ...params,
  };
};
