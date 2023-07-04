import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import ReceiverTemplate from 'src/templates/Admin/Seminar/pushhistory';
import { usePushHistory } from 'src/services/admin/pushhistory/pushhistory.queries';
import dayjs from 'dayjs';

export interface SearchParamsProps {
  pushType: string;
  sendDateFrom: string;
  sendDateTo: string;
  searchKeyword: string;
}

export function PushHistoryPage() {
  const now = dayjs();
  const tomorrow = now.add(1, 'day');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [params, setParams] = useState<SearchParamsProps>({
    pushType: '',
    sendDateFrom: `${now?.format('YYYY-MM-DD')} 00:00:00.000`,
    sendDateTo: `${tomorrow.format('YYYY-MM-DD')} 00:00:00.000`,
    searchKeyword: '',
  });

  const { data: pushHistoryList, refetch }: UseQueryResult<any> = usePushHistory(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: pushHistoryList?.totalPage || 1,
    total: pushHistoryList?.totalPage || 15,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onSearch = async (params: SearchParamsProps) => {
    if (!params?.sendDateFrom || !params?.sendDateTo) {
      alert('기간을 설정하세요');
    } else {
      setPage(1);
      setParams({
        ...params,
      });
      await refetch();
    }
  };

  return (
    <ReceiverTemplate
      pushHistoryList={pushHistoryList && pushHistoryList}
      onSearch={onSearch}
      setParams={setParams}
      params={params}
      pageProps={PAGE_PROPS}
    />
  );
}

export default PushHistoryPage;

PushHistoryPage.Layout = AdminLayout;
PushHistoryPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '메세지발송이력',
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
