import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';

import AdminLayout from '../../../../src/stories/Layout/AdminLayout';
import { useMentors } from '../../../../src/services/admin/mentors/mentors.queries';
import GrowthStoryTemplate from '../../../../src/templates/Admin/GrowthStory';
import { useMentorUri } from '../../../../src/services/mentors/mentors.queries';
import { useJobGroups, useMemberCode } from '../../../../src/services/code/code.queries';
import { ExperiencesResponse } from '../../../../src/models/experiences';
import { useExperiences } from '../../../../src/services/experiences/experiences.queries';
import { SkillResponse } from '../../../../src/models/skills';
import { useSkills } from '../../../../src/services/skill/skill.queries';
import { useSaveGrowthStory } from '../../../../src/services/mentors/mentors.mutations';
import { useMentoringDelete } from '../../../../src/services/admin/mentors/mentors.mutations';

export function MentorsPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [mentorUri, setMentorUri] = useState<string>('');
  const [params, setParams] = useState<any>({});

  const { data: mentorStoryData, refetch }: UseQueryResult<any> = useMentorUri(mentorUri);
  const { data: jobCodes } = useJobGroups();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: memberCodes } = useMemberCode();

  const { data: mentorList, refetch: memberListRefetch }: UseQueryResult<any> = useMentors(
    paramsWithDefault({
      page: page,
      size: size,
      searchKeyword: search,
      ...params,
    }),
  );

  const { mutate: onSaveGrowthStory, isSuccess, isError } = useSaveGrowthStory();
  const { mutate: onDeleteGrowthStory } = useMentoringDelete();

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: mentorList?.totalPage,
    total: mentorList?.totalPage,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onMentorInfo = (id: string) => {
    setMentorUri(id);
  };

  const onSearch = async (params: any) => {
    setPage(1);
    if (typeof params === 'object') {
      setParams(params);
    } else {
      setSearch(params);
    }
    await memberListRefetch();
  };

  const onSave = (params: any) => {
    delete params.skills;
    delete params.experiences;
    if (confirm('수정하시겠습니까?')) {
      onSaveGrowthStory(params);
    }
  };

  const onDelete = (mentorId: string) => {
    if (confirm('삭제하시겠습니까?')) {
      onDeleteGrowthStory(mentorId);
    }
  };

  return (
    <GrowthStoryTemplate
      mentorList={mentorList}
      onMentorInfo={onMentorInfo}
      mentorData={mentorStoryData}
      pageProps={PAGE_PROPS}
      onSearch={onSearch}
      memberCodes={memberCodes}
      jobCodes={jobCodes}
      skillList={skillData}
      experience={experienceData}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}

export default MentorsPage;

MentorsPage.Layout = AdminLayout;
MentorsPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스 관리자',
};

const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    page: 1,
    size: 15,
  };
  return {
    ...defaultParams,
    ...params,
  };
};
