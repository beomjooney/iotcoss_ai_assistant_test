import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import AlarmTemplate from '../../../src/templates/Admin/Alarm';

import { useAlarms, useAlarm } from '../../../src/services/admin/alarm/alarm.queries';
import { useDeleteAlarm } from '../../../src/services/admin/alarm/alarm.mutations';
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

export function AlarmPage() {
  const now = dayjs();
  const past1m = now.subtract(3, 'month');
  const tomorrow = now.add(1, 'day');
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
  const { data: alarmData, refetch }: UseQueryResult<any> = useAlarm(sequence);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: jobs } = useJobs();

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  const { mutate: onDelete } = useDeleteAlarm();

  const {
    data: alarmList,
    refetch: alarmListRefetch,
    error,
  }: UseQueryResult<any> = useAlarms(
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
    count: alarmList?.data?.data?.totalPages || 1,
    total: alarmList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onAlarmInfo = (id: string) => {
    setSequence(id);
  };

  const onDeleteAlarm = (sequence: string) => {
    if (confirm('해당 내용을 삭제하시겠습니까?')) {
      onDelete(sequence);
    }
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
    await alarmListRefetch();
  };

  return (
    <AlarmTemplate
      alarmList={alarmList}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobs={jobs}
      jobCodes={jobCodes}
      contentJobType={contentJobType}
      alarmData={alarmData}
      pageProps={PAGE_PROPS}
      params={params}
      onAlarmInfo={onAlarmInfo}
      onDeleteAlarm={onDeleteAlarm}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default AlarmPage;

AlarmPage.Layout = AdminLayout;
AlarmPage.LayoutProps = {
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
