import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useCodeDetails } from 'src/services/code/code.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import CodeDetailTemplate from 'src/templates/Admin/System/code-detail';
import { useDeleteDetailCode, useSaveDetailCode, useAddDetailCode } from 'src/services/code/code.mutations';

export interface SearchParamsProps {
  searchKeyword: string;
}

export function MangeCodeDetailPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [groupId, setGroupId] = useState<string>('');
  const [params, setParams] = useState<SearchParamsProps>({
    searchKeyword: '',
  });

  const { data: codeDetailList, refetch }: UseQueryResult<any> = useCodeDetails(groupId);

  const { mutate: onDelete } = useDeleteDetailCode();
  const { mutate: onSave } = useSaveDetailCode();
  const { mutate: onAdd } = useAddDetailCode();

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: codeDetailList?.totalPage,
    total: codeDetailList?.totalPage,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onSearch = async groupId => {
    setPage(1);
    setGroupId(groupId);
    await refetch();
  };

  const handleOnAdd = async values => {
    onAdd && onAdd(values);
    await refetch();
  };

  return (
    <CodeDetailTemplate
      codeDetailList={codeDetailList}
      onSearch={onSearch}
      setPage={setPage}
      pageProps={PAGE_PROPS}
      onDelete={onDelete}
      onSave={onSave}
      onAdd={handleOnAdd}
      setGroupId={setGroupId}
      setParams={setParams}
      params={params}
    />
  );
}
MangeCodeDetailPage.Layout = AdminLayout;
MangeCodeDetailPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '코드상세관리',
};

export default MangeCodeDetailPage;

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
