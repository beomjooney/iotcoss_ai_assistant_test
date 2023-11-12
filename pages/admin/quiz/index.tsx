import './index.module.scss';
import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import QuizTemplate from '../../../src/templates/Admin/Quiz';
import {} from '../../../src/services/admin/quiz/quiz.queries';
import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import {} from '../../../src/services/admin/quiz/quiz.mutations';
import { useJobGroups, useMemberCode } from '../../../src/services/code/code.queries';

export function QuizPage() {
  //   const [page, setPage] = useState<number>(1);
  //   const [size, setSize] = useState<number>(15);
  //   const [search, setSearch] = useState<string>('');
  //   const [memberId, setMemberId] = useState<string>('');
  //   const [params, setParams] = useState<any>({});

  //   const { data: memberData, refetch }: UseQueryResult<any> = useMember(memberId);
  //   const { data: memberCodes } = useMemberCode();
  //   const { data: jobCodes } = useJobGroups();
  //   const { mutate: onSave } = useSaveMember();
  //   const { mutate: onDelete } = useDeleteMember();

  //   useEffect(() => {
  //     memberId && refetch();
  //   }, [memberId]);

  //   const {
  //     data: memberList,
  //     refetch: memberListRefetch,
  //     error,
  //   }: UseQueryResult<any> = useMembers(
  //     paramsWithDefault({
  //       page: page,
  //       size: size,
  //       searchKeyword: search,
  //       ...params,
  //     }),
  //   );

  //   useEffect(() => {
  //     if (error) {
  //       console.log(error);
  //     }
  //   }, [error]);

  //   const PAGE_PROPS = {
  //     page: page,
  //     setPage: setPage,
  //     count: memberList?.data?.totalPage,
  //     total: memberList?.data?.totalPage,
  //     onChangeSize: size => {
  //       setSize(size);
  //       setPage(1);
  //     },
  //     size: size,
  //   };

  //   const onMemberInfo = (id: string) => {
  //     setMemberId(id);
  //   };

  //   const onDeleteMember = (id: string) => {
  //     if (confirm('해당 회원을 삭제하시겠습니까?')) {
  //       onDelete(id);
  //     }
  //   };

  //   const onSaveMember = (data: any) => {
  //     if (confirm('저장하시겠습니까?')) {
  //       onSave({
  //         ...data,
  //       });
  //     }
  //   };

  //   const onSearch = async (params: any) => {
  //     setPage(1);
  //     if (typeof params === 'object') {
  //       setParams(params);
  //     } else {
  //       setSearch(params);
  //     }
  //     await memberListRefetch();
  //   };

  //   return (
  //     <QuizTemplate
  //       memberList={memberList}
  //       onMemberInfo={onMemberInfo}
  //       memberData={memberData}
  //       memberCodes={memberCodes}
  //       jobCodes={jobCodes}
  //       pageProps={PAGE_PROPS}
  //       onDeleteMember={onDeleteMember}
  //       onSave={onSaveMember}
  //       onSearch={onSearch}
  //     />
  //   );

  return <QuizTemplate />;
}

export default QuizPage;

QuizPage.Layout = AdminLayout;
QuizPage.LayoutProps = {
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
