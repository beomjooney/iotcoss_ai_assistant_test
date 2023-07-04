import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useAddPost, useDeletePost, useSavePost } from 'src/services/admin/camenity/camenity.mutations';
import { useCamenities } from 'src/services/admin/camenity/camenity.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import CamenityTemplate from 'src/templates/Admin/Contents/Camenity';

export interface SearchParamsProps {
  searchKeyword: string;
}

export function CamenityPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(200);
  const [params, setParams] = useState<SearchParamsProps>({
    searchKeyword: '',
  });

  const { data: camenitiesList, refetch }: UseQueryResult<any> = useCamenities(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );
  const { mutate: onSave } = useSavePost();
  const { mutate: onDelete } = useDeletePost();
  const { mutate: onAdd } = useAddPost();
  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: camenitiesList?.totalPage,
    total: camenitiesList?.totalPage,
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
    <CamenityTemplate
      camenitiesList={camenitiesList}
      setParams={setParams}
      onSearch={onSearch}
      setPage={setPage}
      onSave={onSave}
      onDelete={onDelete}
      onAdd={handleOnAdd}
      params={params}
      pageProps={PAGE_PROPS}
    />
  );
}
CamenityPage.Layout = AdminLayout;
CamenityPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커멘니티',
};

export default CamenityPage;

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
