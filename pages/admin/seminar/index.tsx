import './index.module.scss';
import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import {
  useSeminarDetail,
  useSeminarList,
  useSeminarParticipantList,
} from '../../../src/services/seminars/seminars.queries';
import { AdminSeminarTemplate } from '../../../src/templates';
import {
  useSaveSeminar,
  useDeleteSeminar,
  useParticipantApplySeminar,
  useUpdateSeminar,
} from '../../../src/services/seminars/seminars.mutations';
import {
  useJobGroups,
  useSeminarPaymentTypes,
  useSeminarStatus,
  useSeminarTypes,
} from '../../../src/services/code/code.queries';

export function SeminarPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [seminarId, setSeminarId] = useState<string>('');
  const [params, setParams] = useState<any>({});

  const { data: seminarList, refetch: seminarListRefetch }: UseQueryResult<any> = useSeminarList(
    paramsWithDefault({
      page: page,
      size: size,
      searchKeyword: search,
      ...params,
    }),
  );

  const { data: seminarData, refetch: seminarDataRefetch }: UseQueryResult<any> = useSeminarDetail(seminarId);
  const { data: seminarParticipantList, refetch: seminarParticipantRefetch }: UseQueryResult<any> =
    useSeminarParticipantList(seminarId);
  const { data: jobCodes } = useJobGroups();
  const { data: seminarTypes } = useSeminarTypes();
  const { data: seminarStatus } = useSeminarStatus();
  const { data: paymentTypes } = useSeminarPaymentTypes();
  const { mutate: seminarApply } = useParticipantApplySeminar();
  const { mutate: updateSeminar } = useUpdateSeminar();
  const { mutate: deleteSeminar } = useDeleteSeminar();
  const { mutate: onAdd } = useSaveSeminar();

  useEffect(() => {
    seminarId && seminarDataRefetch();
    seminarId && seminarParticipantRefetch();
  }, [seminarId]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: seminarList?.totalPage,
    total: seminarList?.totalPage,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onSearch = async (params: any) => {
    setPage(1);
    if (typeof params === 'object') {
      setParams(params);
    } else {
      setSearch(params);
    }
    await seminarListRefetch();
  };

  const onSeminarInfo = (id: string) => {
    setSeminarId(id);
  };

  const onSeminarApply = async (data: any) => {
    const params = {
      ...data,
      seminarId: seminarId,
    };
    const message = ['0001', '0003', '0004'].includes(data.approvalStatus)
      ? '세미나 참가 신청을 반려하시겠습니까?'
      : '세미나 참가 신청을 승인하시겠습니까?';
    if (confirm(message)) {
      seminarApply(params);
    }
    setTimeout(() => {
      seminarParticipantRefetch();
    }, 1000);
  };

  const onSave = (params: any) => {
    if (confirm('저장하시겠습니까?')) {
      updateSeminar(params);
    }
  };

  const onDelete = (seminarId: string) => {
    if (confirm('세미나를 삭제하시겠습니까?')) {
      deleteSeminar(seminarId);
    }
  };

  const onAddSeminar = (params: any) => {
    onAdd && onAdd(params);
  };

  return (
    <AdminSeminarTemplate
      seminarList={seminarList}
      seminarData={seminarData}
      seminarParticipantList={seminarParticipantList}
      jobCodes={jobCodes}
      seminarTypes={seminarTypes}
      seminarStatus={seminarStatus}
      paymentTypes={paymentTypes}
      pageProps={PAGE_PROPS}
      onSeminarInfo={onSeminarInfo}
      onSearch={onSearch}
      onSeminarApply={onSeminarApply}
      onSave={onSave}
      onDelete={onDelete}
      onAdd={onAddSeminar}
    />
  );
}

export default SeminarPage;

SeminarPage.Layout = AdminLayout;
SeminarPage.LayoutProps = {
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
