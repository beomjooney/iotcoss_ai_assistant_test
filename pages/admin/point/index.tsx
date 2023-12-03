import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import PointTemplate from '../../../src/templates/Admin/Point';

import { usePoint, usePoints } from '../../../src/services/admin/point/point.queries';
//import { useDeletePoint, useSavePoint, useAddPoint } from '../../../src/services/admin/point/point.mutations';
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

export function PointPage() {
  const now = dayjs();
  const past1m = dayjs(now.subtract(3, 'month'));
  const tomorrow = dayjs(now.add(1, 'day'));
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [sequence, setSequence] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    createdAtFrom: `${past1m?.format('YYYY-MM-DD')} 00:00:00`,
    createdAtTo: `${tomorrow.format('YYYY-MM-DD')} 00:00:00`,
    keyword: '',
  });

  const { data: jobCodes } = useContentTypes();
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: pointData, refetch }: UseQueryResult<any> = usePoint(sequence);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  //   const { mutate: onSave } = useSavePoint();
  //   const { mutate: onDelete } = useDeletePoint();
  //   const { mutate: onAdd } = useAddPoint();

  const {
    data: pointList,
    refetch: pointListRefetch,
    error,
  }: UseQueryResult<any> = usePoints(
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
    count: pointList?.data?.data?.totalPages || 1,
    total: pointList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onPointInfo = (id: string) => {
    setSequence(id);
  };

  //   const onDeletePoint = (id: string) => {
  //     if (confirm('해당 내용을 삭제하시겠습니까?')) {
  //       onDelete(id);
  //     }
  //   };

  //   const onSavePoint = (data: any) => {
  //     if (confirm('저장하시겠습니까?')) {
  //       onSave({
  //         ...data,
  //       });
  //     }
  //   };

  //   const onAddPoint = (params: any) => {
  //     onAdd && onAdd(params);
  //   };

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
    await pointListRefetch();
  };

  return (
    <PointTemplate
      pointList={pointList}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobs={jobs}
      jobCodes={jobCodes}
      contentJobType={contentJobType}
      pointData={pointData}
      pageProps={PAGE_PROPS}
      params={params}
      onPointInfo={onPointInfo}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default PointPage;

PointPage.Layout = AdminLayout;
PointPage.LayoutProps = {
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
