import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useDeleteContent,
  useSaveContent,
  useAddContent,
} from 'src/services/admin/contents/recommend-contents.mutations';
import { useRecommendContents } from 'src/services/admin/contents/recommend-contents.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import RecommendContentsTemplate from 'src/templates/Admin/Contents/Recommend-contents';

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

export function RecommendContentsPage() {
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

  const { data: recommendContentsList, refetch }: UseQueryResult<any> = useRecommendContents(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );
  const { mutate: onSave } = useSaveContent();
  const { mutate: onDelete } = useDeleteContent();
  const { mutate: onAdd } = useAddContent();
  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: recommendContentsList?.totalPage,
    total: recommendContentsList?.totalPage,
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
    <RecommendContentsTemplate
      recommendList={recommendContentsList}
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
RecommendContentsPage.Layout = AdminLayout;
RecommendContentsPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '추천컨텐츠',
};

export default RecommendContentsPage;

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
