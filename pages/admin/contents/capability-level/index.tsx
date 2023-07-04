import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import CapabilityLevelTemplate from 'src/templates/Admin/Contents/CapabilityLevel';
import {
  useAddCapabilitiesLevel,
  useDeleteCapabilitiesLevel,
  useSaveCapabilitiesLevel,
} from 'src/services/admin/capabilityLevel/capabilityLevel.mutations';
import { useCapabilitiesLevel } from 'src/services/admin/capabilityLevel/capabilityLevel.queries';

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

  const { data: capablityLevelList, refetch }: UseQueryResult<any> = useCapabilitiesLevel(groupId);

  const { mutate: onDelete } = useDeleteCapabilitiesLevel();
  const { mutate: onSave } = useSaveCapabilitiesLevel();
  const { mutate: onAdd } = useAddCapabilitiesLevel();

  const PAGE_PROPS = {
    page: page,
    count: capablityLevelList?.totalPage,
    total: capablityLevelList?.totalPage,
    setPage: setPage,
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
    <CapabilityLevelTemplate
      capablityLevelList={capablityLevelList}
      onSearch={onSearch}
      setPage={setPage}
      pageProps={PAGE_PROPS}
      onDelete={onDelete}
      onSave={onSave}
      onAdd={handleOnAdd}
      setParams={setParams}
      params={params}
    />
  );
}
MangeCodeDetailPage.Layout = AdminLayout;
MangeCodeDetailPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '역량레벨',
};

export default MangeCodeDetailPage;
