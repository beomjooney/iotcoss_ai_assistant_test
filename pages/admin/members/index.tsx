import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import MembersTemplate from '../../../src/templates/Admin/Members';

import { useMember, useMembers } from '../../../src/services/admin/members/members.queries';
import { useDeleteMember, useSaveMember } from '../../../src/services/admin/members/members.mutations';
import { useJobGroups, useMemberCode, useContentTypes } from 'src/services/code/code.queries';

import { useSkills } from 'src/services/admin/skill/skill.queries';

import { ExperiencesResponse } from 'src/models/experiences';
import { useExperiences } from 'src/services/experiences/experiences.queries';

export interface SearchParamsProps {
  createdAtFrom: string;
  createdAtTo: string;
  keyword: string;
}

export function MembersPage() {
  const now = dayjs();
  const past1y = now.subtract(1, 'year');
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    createdAtFrom: `${past1y?.format('YYYY-MM-DD')} 00:00:00`,
    createdAtTo: `${tomorrow.format('YYYY-MM-DD')} 00:00:00`,
    keyword: '',
  });

  const { data: jobCodes } = useContentTypes();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  const { data: memberData, refetch }: UseQueryResult<any> = useMember(memberId);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: memberCodes } = useMemberCode();

  const { mutate: onSave } = useSaveMember();
  const { mutate: onDelete } = useDeleteMember();

  const {
    data: memberList,
    refetch: memberListRefetch,
    error,
  }: UseQueryResult<any> = useMembers(
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
    memberId && refetch();
  }, [memberId]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: memberList?.data?.data?.totalPages || 1,
    total: memberList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onMemberInfo = (id: string) => {
    setMemberId(id);
  };

  const onDeleteMember = (id: string) => {
    if (confirm('해당 회원을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const onSaveMember = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave({
        ...data,
      });
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
    await memberListRefetch();
  };

  return (
    <MembersTemplate
      memberList={memberList}
      skillsList={skillsList}
      experience={experienceData}
      jobGroup={jobGroup}
      jobCodes={jobCodes}
      memberData={memberData}
      memberCodes={memberCodes}
      pageProps={PAGE_PROPS}
      params={params}
      onMemberInfo={onMemberInfo}
      onDeleteMember={onDeleteMember}
      onSave={onSaveMember}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default MembersPage;

MembersPage.Layout = AdminLayout;
MembersPage.LayoutProps = {
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
