import './index.module.scss';

import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import CodeDetailTemplate from '../../../src/templates/Admin/CodeDetail';
import { useCodeList } from '../../../src/services/code/code.queries';

import { useCodeDetail, useCodeDetails } from '../../../src/services/admin/codeDetail/codeDetail.queries';
import { useCodeGroups } from '../../../src/services/admin/codeGroup/codeGroup.queries';

import {
  useDeleteCodeDetail,
  useSaveCodeDetail,
  useAddCodeDetail,
} from '../../../src/services/admin/codeDetail/codeDetail.mutations';

export interface SearchParamsProps {
  keyword: string;
  groupId: string;
}

export function CodeDetailPage() {
  const now = dayjs();
  const past1y = now.subtract(1, 'year');
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [search, setSearch] = useState<string>('');
  const [codeDetailId, setCodeDetailId] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    keyword: '',
    groupId: '1101',
  });

  const {
    data: codeDetailList,
    refetch: codeDetailListRefetch,
    error,
  }: UseQueryResult<any> = useCodeDetails(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );

  const { data: codeGroupList }: UseQueryResult<any> = useCodeGroups(
    paramsWithDefault({
      page: page,
      size: size,
    }),
  );

  const { data: codeDetailData, refetch }: UseQueryResult<any> = useCodeDetail(codeDetailId);

  const { mutate: onSave } = useSaveCodeDetail();
  const { mutate: onDelete } = useDeleteCodeDetail();
  const { mutate: onAdd } = useAddCodeDetail();

  useEffect(() => {
    codeDetailId && refetch();
  }, [codeDetailId]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: codeDetailList?.data?.data?.totalPages || 1,
    total: codeDetailList?.data?.data?.totalPages || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onCodeDetailInfo = (id: string) => {
    setCodeDetailId(id);
  };

  const onDeleteCodeDetail = (id: string) => {
    if (confirm('해당 내용을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const onSaveCodeDetail = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave({
        ...data,
      });
    }
  };

  const onAddCodeDetail = (params: any) => {
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
    await codeDetailListRefetch();
  };

  return (
    <CodeDetailTemplate
      codeDetailList={codeDetailList}
      codeGroupList={codeGroupList}
      codeDetailData={codeDetailData}
      pageProps={PAGE_PROPS}
      params={params}
      onCodeDetailInfo={onCodeDetailInfo}
      onDeleteCodeDetail={onDeleteCodeDetail}
      onSave={onSaveCodeDetail}
      onAdd={onAddCodeDetail}
      onSearch={onSearch}
      setParams={setParams}
    />
  );
}

export default CodeDetailPage;

CodeDetailPage.Layout = AdminLayout;
CodeDetailPage.LayoutProps = {
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
