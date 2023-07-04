import './index.module.scss';
import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import MentorsTemplate from '../../../src/templates/Admin/Mentors';
import { useMentors } from '../../../src/services/admin/mentors/mentors.queries';
import { useMentorUri } from '../../../src/services/mentors/mentors.queries';
import {
  useMentorApprove,
  useMentorCertification,
  useMentorReject,
} from '../../../src/services/admin/mentors/mentors.mutations';

export function MentorsPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [mentorUri, setMentorUri] = useState<string>('');
  const [params, setParams] = useState<any>({});

  const { data: mentorStoryData, refetch }: UseQueryResult<any> = useMentorUri(mentorUri);
  const { mutate: onMentorApprove } = useMentorApprove();
  const { mutate: onMentorReject } = useMentorReject();
  const { mutate: onMentorCertification } = useMentorCertification();

  useEffect(() => {
    mentorUri && refetch();
  }, [mentorUri]);

  const { data: mentorList, refetch: memberListRefetch }: UseQueryResult<any> = useMentors(
    paramsWithDefault({
      page: page,
      size: size,
      types: '0002, 0003',
      searchKeyword: search,
      ...params,
    }),
  );

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: mentorList?.totalPage,
    total: mentorList?.totalPage,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onMentorInfo = (id: string) => {
    setMentorUri(id);
  };

  const onApprove = (mentorId: any) => {
    if (confirm('승인하시겠습니까?')) {
      onMentorApprove({
        mentorId,
        type: '0004',
      });
    }
  };

  const onReject = (mentorId: any) => {
    if (confirm('승인 거절 하시겠습니까?')) {
      onMentorReject({
        mentorId,
        type: '0003',
      });
    }
  };

  const onCertification = (mentorId: any) => {
    if (confirm('인증 하시겠습니까?')) {
      onMentorCertification({
        mentorId,
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
    <MentorsTemplate
      mentorList={mentorList}
      onMentorInfo={onMentorInfo}
      mentorData={mentorStoryData}
      pageProps={PAGE_PROPS}
      onMentorApprove={onApprove}
      onMentorReject={onReject}
      onCertification={onCertification}
      onSearch={onSearch}
    />
  );
}

export default MentorsPage;

MentorsPage.Layout = AdminLayout;
MentorsPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스 관리자',
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
