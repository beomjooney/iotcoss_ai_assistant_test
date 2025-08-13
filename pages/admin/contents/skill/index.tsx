import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../../src/stories/Layout/AdminLayout';
import SkillTemplate from '../../../../src/templates/Admin/Contents/Skill';

import { useDevusSkill, useDevusSkills } from '../../../../src/services/admin/skill/skill.queries';
import {
  useDeleteDevusSkill,
  useSaveDevusSkill,
  useAddDevusSkill,
} from '../../../../src/services/admin/skill/skill.mutations';
import {
  useContentJobTypes,
  useJobGroups,
  useMemberCode,
  useContentTypes,
  useJobs,
} from 'src/services/code/code.queries';

import { useSkills } from 'src/services/admin/skill/skill.queries';

import { ExperiencesResponse } from 'src/models/experiences';
import { useExperiences } from 'src/services/experiences/experiences.queries';

export interface SearchParamsProps {
  createdAtFrom: string;
  createdAtTo: string;
  keyword: string;
}

export function SkillPage() {
  const now = dayjs();
  const past1y = now.subtract(1, 'year');
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [skillId, setSkillId] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    createdAtFrom: `${past1y?.format('YYYY-MM-DD')} 00:00:00`,
    createdAtTo: `${tomorrow.format('YYYY-MM-DD')} 00:00:00`,
    keyword: '',
  });

  const { data: jobCodes } = useContentTypes();
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: devusSkillData, refetch }: UseQueryResult<any> = useDevusSkill(skillId);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { mutate: onSave } = useSaveDevusSkill();
  const { mutate: onDelete } = useDeleteDevusSkill();
  const { mutate: onAdd } = useAddDevusSkill();

  const {
    data: devusSkillList,
    refetch: quizListRefetch,
    error,
  }: UseQueryResult<any> = useDevusSkills(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );

  const { data: skillsList }: UseQueryResult<any> = useSkills(
    paramsWithDefault({
      page: page,
      size: size,
    }),
  );

  // const { data: experienceData }: UseQueryResult<any> = useExperiences(
  //   paramsWithDefault({
  //     page: page,
  //     size: size,
  //   }),
  // );

  useEffect(() => {
    skillId && refetch();
  }, [skillId]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: devusSkillList?.data?.data?.totalPages || 1,
    total: devusSkillList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onSkillInfo = (id: string) => {
    setSkillId(id);
  };

  const onDeleteSkill = (id: string) => {
    if (confirm('해당 내용을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const onSaveSkill = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave({
        ...data,
      });
    }
  };

  const onAddSkill = (params: any) => {
    onAdd && onAdd(params);
  };

  const onSearch = async (params: SearchParamsProps) => {
    setPage(1);
    // if (!params?.createdAtFrom || !params?.createdAtTo) {
    //   alert('기간을 설정하세요');
    // }

    if (typeof params === 'object') {
      setParams({
        ...params,
      });
    } else {
      setSearch(params);
    }
    await quizListRefetch();
  };

  return (
    <SkillTemplate
      devusSkillList={devusSkillList}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobs={jobs}
      jobCodes={jobCodes}
      contentJobType={contentJobType}
      devusSkillData={devusSkillData}
      pageProps={PAGE_PROPS}
      params={params}
      onSkillInfo={onSkillInfo}
      onDeleteSkill={onDeleteSkill}
      onSave={onSaveSkill}
      onAdd={onAddSkill}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default SkillPage;

SkillPage.Layout = AdminLayout;
SkillPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스 관리자',
};

const paramsWithDefault = params => {
  const defaultParams = {
    page: 1,
    size: 15,
  };
  return {
    ...defaultParams,
    ...params,
  };
};
