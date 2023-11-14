import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import AdminClubQuizTemplate from '../../../src/templates/Admin/ClubQuiz';

import { useClub, useClubs } from '../../../src/services/club/clubs.queries';
import { useDeleteClub, useSaveClub } from '../../../src/services/club/clubs.mutations';
import { useJobGroups, useMemberCode, useContentTypes } from 'src/services/code/code.queries';

import { useSkills } from 'src/services/admin/skill/skill.queries';

import { ExperiencesResponse } from 'src/models/experiences';
import { useExperiences } from 'src/services/experiences/experiences.queries';

export interface SearchParamsProps {
  page: number;
  size: number;
  createdAtFrom: string;
  createdAtTo: string;
  keyword: string;
}

export function ClubQuizPage() {
  const now = dayjs();
  const past1y = now.subtract(1, 'year');
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [clubId, setClubId] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    page: page,
    size: size,
    createdAtFrom: `${past1y?.format('YYYY-MM-DD')} 00:00:00`,
    createdAtTo: `${tomorrow.format('YYYY-MM-DD')} 00:00:00`,
    keyword: '',
  });

  const { data: jobCodes } = useContentTypes();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: clubData, refetch }: UseQueryResult<any> = useClub(clubId);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();

  const { data: skillData }: UseQueryResult<any> = useSkills(
    paramsWithDefault({
      page: page,
      size: size,
    }),
  );

  const { mutate: onSave } = useSaveClub();
  const { mutate: onDelete } = useDeleteClub();

  useEffect(() => {
    clubId && refetch();
  }, [clubId]);

  const {
    data: clubList,
    refetch: clubListRefetch,
    error,
  }: UseQueryResult<any> = useClubs(
    paramsWithDefault({
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
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: clubList?.data?.data?.totalPages,
    total: clubList?.data?.data?.totalPages,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onClubInfo = (id: string) => {
    setClubId(id);
  };

  const onDeleteClub = (id: string) => {
    if (confirm('해당 클럽을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const onSaveClub = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave({
        ...data,
      });
    }
  };

  const onSearch = async (params: SearchParamsProps) => {
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
    await clubListRefetch();
  };

  return (
    <AdminClubQuizTemplate
      clubList={clubList}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobCodes={jobCodes}
      clubData={clubData}
      pageProps={PAGE_PROPS}
      params={params}
      onClubInfo={onClubInfo}
      onDeleteClub={onDeleteClub}
      onSave={onSaveClub}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default ClubQuizPage;

ClubQuizPage.Layout = AdminLayout;
ClubQuizPage.LayoutProps = {
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
