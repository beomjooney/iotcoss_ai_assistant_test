import './index.module.scss';
import { useEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import { AdminClubQuizTemplate } from '../../../src/templates';

import {} from '../../../src/services/club/clubs.queries';
import {} from '../../../src/services/club/clubs.mutations';

import { useClub, useClubs } from '../../../src/services/club/clubs.queries';
import { useDeleteClub, useSaveClub } from '../../../src/services/club/clubs.mutations';
import { useJobGroups, useJobs } from 'src/services/code/code.queries';
import { ExperiencesResponse } from 'src/models/experiences';
import { useExperiences } from 'src/services/experiences/experiences.queries';
import { useSkills } from 'src/services/admin/skill/skill.queries';

export function ClubQuizPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [clubId, setClubId] = useState<string>('');
  const [params, setParams] = useState<any>({});

  const { data: jobCodes } = useJobs();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: clubData, refetch }: UseQueryResult<any> = useClub(clubId);

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
      page: page,
      size: size,
      searchKeyword: search,
      ...params,
    }),
  );

  const { data: skillsList }: UseQueryResult<any> = useSkills(
    paramsWithDefault({
      page: page,
      size: size,
    }),
  );

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: clubList?.data?.totalPage,
    total: clubList?.data?.totalPage,
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
    if (confirm('해당 회원을 삭제하시겠습니까?')) {
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

  const onSearch = async (params: any) => {
    setPage(1);
    if (typeof params === 'object') {
      setParams(params);
    } else {
      setSearch(params);
    }
    await clubListRefetch();
  };

  return (
    <AdminClubQuizTemplate
      clubList={clubList}
      clubData={clubData}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobCodes={jobCodes}
      onClubInfo={onClubInfo}
      pageProps={PAGE_PROPS}
      onDeleteClub={onDeleteClub}
      onSave={onSaveClub}
      onSearch={onSearch}
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
