import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useAddGrowthEdge,
  useDeleteGrowthEdge,
  useSaveGrowthEdge,
} from 'src/services/admin/growthEdge/growthEdge.mutations';
import { useGetEdgeList } from 'src/services/admin/growthEdge/growthEdge.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import GrowthEdgeTemplate from 'src/templates/Admin/Contents/GrowthEdge';

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

export function GrowthEdgePage() {
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

  const { data: edgeList, refetch }: UseQueryResult<any> = useGetEdgeList(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );
  const { mutate: onSave } = useSaveGrowthEdge();
  const { mutate: onDelete } = useDeleteGrowthEdge();
  const { mutate: onAdd } = useAddGrowthEdge();
  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: edgeList?.totalPage,
    total: edgeList?.totalPage,
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
    <GrowthEdgeTemplate
      edgeList={edgeList}
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
GrowthEdgePage.Layout = AdminLayout;
GrowthEdgePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '성장엣지',
};

export default GrowthEdgePage;

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
