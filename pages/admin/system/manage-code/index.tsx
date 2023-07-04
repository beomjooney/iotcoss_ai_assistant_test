import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useCodeList } from 'src/services/code/code.queries';
import { useDeleteCodeList, useSaveCodeList, useAddCode } from 'src/services/code/code.mutations';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import ManageCodeTemplate from 'src/templates/Admin/System/manage-code';

export interface SearchParamsProps {
  searchKeyword: string;
}

export function ManageCodePage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [params, setParams] = useState<SearchParamsProps>({
    searchKeyword: '',
  });

  const { mutate: onDelete } = useDeleteCodeList();
  const { mutate: onSave } = useSaveCodeList();
  const { mutate: onAdd } = useAddCode();

  const { data: codeList, refetch }: UseQueryResult<any> = useCodeList(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: codeList?.totalPage,
    total: codeList?.totalPage,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onSearch = async (params: SearchParamsProps) => {
    setPage(1);
    setParams({
      ...params,
    });
    await refetch();
  };

  const handleOnAdd = async values => {
    onAdd && onAdd(values);
    await refetch();
  };

  return (
    <ManageCodeTemplate
      codeList={codeList}
      onSearch={onSearch}
      setPage={setPage}
      onSave={onSave}
      onDelete={onDelete}
      setParams={setParams}
      params={params}
      onAdd={handleOnAdd}
      pageProps={PAGE_PROPS}
    />
  );
}
ManageCodePage.Layout = AdminLayout;
ManageCodePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '코드그룹관리',
};

export default ManageCodePage;

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
