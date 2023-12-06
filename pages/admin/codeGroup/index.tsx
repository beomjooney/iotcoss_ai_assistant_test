import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import CodeGroupTemplate from '../../../src/templates/Admin/CodeGroup';

import { useCodeGroup, useCodeGroups } from '../../../src/services/admin/codeGroup/codeGroup.queries';
import {
  useDeleteCodeGroup,
  useSaveCodeGroup,
  useAddCodeGroup,
} from '../../../src/services/admin/codeGroup/codeGroup.mutations';
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

export function CodeGroupPage() {
  const now = dayjs();
  const past1y = now.subtract(1, 'year');
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [codeGroupId, setCodeGroupId] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    createdAtFrom: `${past1y?.format('YYYY-MM-DD')} 00:00:00`,
    createdAtTo: `${tomorrow.format('YYYY-MM-DD')} 00:00:00`,
    keyword: '',
  });

  const { data: jobCodes } = useContentTypes();
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: codeGroupData, refetch }: UseQueryResult<any> = useCodeGroup(codeGroupId);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { mutate: onSave } = useSaveCodeGroup();
  const { mutate: onDelete } = useDeleteCodeGroup();
  const { mutate: onAdd } = useAddCodeGroup();

  const {
    data: codeGroupList,
    refetch: codeGroupListRefetch,
    error,
  }: UseQueryResult<any> = useCodeGroups(
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
    codeGroupId && refetch();
  }, [codeGroupId]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: codeGroupList?.data?.data?.totalPages || 1,
    total: codeGroupList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onCodeGroupInfo = (id: string) => {
    setCodeGroupId(id);
  };

  const onDeleteCodeGroup = (id: string) => {
    if (confirm('해당 내용을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const onSaveCodeGroup = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave({
        ...data,
      });
    }
  };

  const onAddCodeGroup = (params: any) => {
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
    await codeGroupListRefetch();
  };

  return (
    <CodeGroupTemplate
      codeGroupList={codeGroupList}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobs={jobs}
      jobCodes={jobCodes}
      contentJobType={contentJobType}
      codeGroupData={codeGroupData}
      pageProps={PAGE_PROPS}
      params={params}
      onCodeGroupInfo={onCodeGroupInfo}
      onDeleteCodeGroup={onDeleteCodeGroup}
      onSave={onSaveCodeGroup}
      onAdd={onAddCodeGroup}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default CodeGroupPage;

CodeGroupPage.Layout = AdminLayout;
CodeGroupPage.LayoutProps = {
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
