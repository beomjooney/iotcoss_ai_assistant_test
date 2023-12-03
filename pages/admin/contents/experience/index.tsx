import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../../src/stories/Layout/AdminLayout';
import ExperienceTemplate from '../../../../src/templates/Admin/Contents/Experience';

import { useDevusExperience, useDevusExperiences } from '../../../../src/services/admin/experience/experience.queries';
import {
  useDeleteDevusExperience,
  useSaveDevusExperience,
  useAddDevusExperience,
} from '../../../../src/services/admin/experience/experience.mutations';
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
  keyword: string;
}

export function ExperiencePage() {
  const now = dayjs();
  const past1y = now.subtract(1, 'year');
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [experienceId, setExperienceId] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    keyword: '',
  });

  const { data: jobCodes } = useContentTypes();
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: devusExperienceData, refetch }: UseQueryResult<any> = useDevusExperience(experienceId);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { mutate: onSave } = useSaveDevusExperience();
  const { mutate: onDelete } = useDeleteDevusExperience();
  const { mutate: onAdd } = useAddDevusExperience();

  const {
    data: devusExperienceList,
    refetch: experienceListRefetch,
    error,
  }: UseQueryResult<any> = useDevusExperiences(
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
    experienceId && refetch();
  }, [experienceId]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: devusExperienceList?.data?.data?.totalPages || 1,
    total: devusExperienceList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onExperienceInfo = (id: string) => {
    setExperienceId(id);
  };

  const onDeleteExperience = (id: string) => {
    if (confirm('해당 내용을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const onSaveExperience = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave({
        ...data,
      });
    }
  };

  const onAddExperience = (params: any) => {
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
    await experienceListRefetch();
  };

  return (
    <ExperienceTemplate
      devusExperienceList={devusExperienceList}
      skillsList={skillsList}
      experienceList={experienceData}
      jobGroup={jobGroup}
      jobs={jobs}
      jobCodes={jobCodes}
      contentJobType={contentJobType}
      devusExperienceData={devusExperienceData}
      pageProps={PAGE_PROPS}
      params={params}
      onExperienceInfo={onExperienceInfo}
      onDeleteExperience={onDeleteExperience}
      onSave={onSaveExperience}
      onAdd={onAddExperience}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default ExperiencePage;

ExperiencePage.Layout = AdminLayout;
ExperiencePage.LayoutProps = {
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
