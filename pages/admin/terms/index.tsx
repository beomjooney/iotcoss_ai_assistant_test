import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import TermsTemplate from '../../../src/templates/Admin/Terms';

import { useTerm, useTerms } from '../../../src/services/admin/terms/terms.queries';
import { useDeleteTerm, useSaveTerm, useAddTerm } from '../../../src/services/admin/terms/terms.mutations';
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

export function TermsPage() {
  const now = dayjs();
  const past1y = now.subtract(1, 'year');
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [sequence, setSequence] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    createdAtFrom: `${past1y?.format('YYYY-MM-DD')} 00:00:00`,
    createdAtTo: `${tomorrow.format('YYYY-MM-DD')} 00:00:00`,
    keyword: '',
  });

  const { data: jobCodes } = useContentTypes();
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: termData, refetch }: UseQueryResult<any> = useTerm(sequence);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { mutate: onSave } = useSaveTerm();
  const { mutate: onDelete } = useDeleteTerm();
  const { mutate: onAdd } = useAddTerm();

  const {
    data: termList,
    refetch: termListRefetch,
    error,
  }: UseQueryResult<any> = useTerms(
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
    sequence && refetch();
  }, [sequence]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: termList?.data?.data?.totalPages || 1,
    total: termList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onTermInfo = (id: string) => {
    setSequence(id);
  };

  const onDeleteTerm = (id: string) => {
    if (confirm('해당 내용을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const onSaveTerm = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave({
        ...data,
      });
    }
  };

  const onAddTerm = (params: any) => {
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
    await termListRefetch();
  };

  return (
    <TermsTemplate
      termList={termList}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobs={jobs}
      jobCodes={jobCodes}
      contentJobType={contentJobType}
      termData={termData}
      pageProps={PAGE_PROPS}
      params={params}
      onTermInfo={onTermInfo}
      onDeleteTerm={onDeleteTerm}
      onSave={onSaveTerm}
      onAdd={onAddTerm}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default TermsPage;

TermsPage.Layout = AdminLayout;
TermsPage.LayoutProps = {
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
