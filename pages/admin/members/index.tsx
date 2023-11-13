import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import MembersTemplate from '../../../src/templates/Admin/Members';

import { useMember, useMembers } from '../../../src/services/admin/members/members.queries';
import { useDeleteMember, useSaveMember } from '../../../src/services/admin/members/members.mutations';
import { useCodeList, useJobGroups, useJobs, useMemberCode } from 'src/services/code/code.queries';

import { SkillResponse } from 'src/models/skills';
import { useSkills } from 'src/services/admin/skill/skill.queries';

import { ExperiencesResponse } from 'src/models/experiences';
import { useExperiences } from 'src/services/experiences/experiences.queries';

export function MembersPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const [params, setParams] = useState<any>({});

  const { data: jobCodes } = useJobs();
  const { data: experienceData }: UseQueryResult<ExperiencesResponse> = useExperiences();
  //const { data: skillData }: UseQueryResult<SkillResponse> = useSkills();
  const { data: memberData, refetch }: UseQueryResult<any> = useMember(memberId);
  const { data: jobGroup, isFetched: isJobGroupFetched } = useJobGroups();
  const { data: memberCodes } = useMemberCode();

  console.log(memberData);

  const { data: skillData }: UseQueryResult<any> = useSkills(
    paramsWithDefault({
      page: page,
      size: size,
    }),
  );

  const { mutate: onSave } = useSaveMember();
  const { mutate: onDelete } = useDeleteMember();

  useEffect(() => {
    memberId && refetch();
  }, [memberId]);

  const {
    data: memberList,
    refetch: memberListRefetch,
    error,
  }: UseQueryResult<any> = useMembers(
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
    count: memberList?.data?.totalPage,
    total: memberList?.data?.totalPage,
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

  const onSearch = async (params: any) => {
    setPage(1);
    if (typeof params === 'object') {
      setParams(params);
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
      onMemberInfo={onMemberInfo}
      memberCodes={memberCodes}
      pageProps={PAGE_PROPS}
      onDeleteMember={onDeleteMember}
      onSave={onSaveMember}
      onSearch={onSearch}
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
