import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useAddGrowthNode,
  useDeleteGrowthNode,
  useSaveGrowthNode,
} from 'src/services/admin/growthNode/growthNode.mutations';
import { useGetNodeList } from 'src/services/admin/growthNode/growthNode.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import GrowthNodeTemplate from 'src/templates/Admin/Contents/GrowthNode';

export interface SearchParamsProps {
  recommendLevels: number;
  seminarEndDateFrom: string;
  contentsId: string;
  contentsName: string;
  contentsType: string;
  recommendJobGroup: string;
  keyword: string;
  seminarEndDateTo: string;
  searchKeyword: string;
}

export function GrowthNodePage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [params, setParams] = useState<SearchParamsProps>({
    recommendLevels: null,
    seminarEndDateTo: '',
    contentsId: '',
    contentsName: '',
    contentsType: '',
    recommendJobGroup: '',
    keyword: '',
    seminarEndDateFrom: '',
    searchKeyword: '',
  });

  const { data: nodeList, refetch }: UseQueryResult<any> = useGetNodeList(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );
  const { mutate: onSave } = useSaveGrowthNode();
  const { mutate: onDelete } = useDeleteGrowthNode();
  const { mutate: onAdd } = useAddGrowthNode();
  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: nodeList?.totalPage,
    total: nodeList?.totalPage,
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
    <GrowthNodeTemplate
      nodeList={nodeList}
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
GrowthNodePage.Layout = AdminLayout;
GrowthNodePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '성장노드',
};

export default GrowthNodePage;

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
