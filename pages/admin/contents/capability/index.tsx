import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  useAddCapabilities,
  useDeleteCapabilities,
  useSaveCapabilities,
} from 'src/services/admin/capability/capability.mutations';
import { useCapabilities } from 'src/services/admin/capability/capability.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import CapabilityTemplate from 'src/templates/Admin/Contents/Capability';

export interface SearchParamsProps {
  searchKeyword: string;
}

export function CapabilityPage() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(15);
  const [params, setParams] = useState<SearchParamsProps>({
    searchKeyword: '',
  });

  const { data: capabilityList, refetch }: UseQueryResult<any> = useCapabilities(
    paramsWithDefault({
      page: page,
      size: size,
      ...params,
    }),
  );
  const { mutate: onSave } = useSaveCapabilities();
  const { mutate: onDelete } = useDeleteCapabilities();
  const { mutate: onAdd } = useAddCapabilities();

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: capabilityList?.totalPage,
    total: capabilityList?.totalPage,
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
    <CapabilityTemplate
      capabilityList={capabilityList}
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
CapabilityPage.Layout = AdminLayout;
CapabilityPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '역량관리',
};

export default CapabilityPage;

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
