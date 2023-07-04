import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useDeleteService,
  useSaveService,
  useAddService,
} from 'src/services/admin/service/recommend-service.mutations';
import { useRecommendService } from 'src/services/admin/service/recommend-service.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import RecommendServiceTemplate from 'src/templates/Admin/Contents/Recommend-service';

export interface SearchParamsProps {
  priceLevel: number;
  paymentType: number;
  priceFrom: number;
  priceTo: number;
  memberCountFrom: number;
  memberCountTo: number;
  internalRecommendLevel: number;
  createdFrom: string;
  createdTo: string;
  serviceId: number;
  companyName: string;
  serviceType: number;
  recommendJobGroups: number;
  recommendLevels: Array<number>;
  searchKeyword: string;
}

export function RecommendServicePage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [params, setParams] = useState<SearchParamsProps>({
    priceLevel: null,
    paymentType: null,
    priceFrom: null,
    priceTo: null,
    memberCountFrom: null,
    memberCountTo: null,
    internalRecommendLevel: null,
    createdTo: '',
    createdFrom: '',
    serviceId: null,
    companyName: '',
    serviceType: null,
    recommendJobGroups: null,
    recommendLevels: null,
    searchKeyword: '',
  });

  const { data: recommendContentsList, refetch }: UseQueryResult<any> = useRecommendService(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );
  const { mutate: onSave } = useSaveService();
  const { mutate: onDelete } = useDeleteService();
  const { mutate: onAdd } = useAddService();

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
    <RecommendServiceTemplate
      recommendList={recommendContentsList}
      setParams={setParams}
      onSearch={onSearch}
      setPage={setPage}
      onSave={onSave}
      onAdd={handleOnAdd}
      onDelete={onDelete}
      params={params}
      pageProps={PAGE_PROPS}
    />
  );
}
RecommendServicePage.Layout = AdminLayout;
RecommendServicePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '추천서비스',
};

export default RecommendServicePage;

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
