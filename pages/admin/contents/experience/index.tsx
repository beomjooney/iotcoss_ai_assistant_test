import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useExperience } from 'src/services/admin/experience/experience.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import ExperienceTemplate from 'src/templates/Admin/Contents/Experience';
import {
  useAddExperience,
  useDeleteExperience,
  useSaveExperience,
} from 'src/services/admin/experience/experience.mutations';

export function ManageExperience() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(25);

  const { data: experienceList, refetch }: UseQueryResult<any> = useExperience(
    paramsWithDefault({
      page: page,
      size: size,
    }),
  );

  const { mutate: onDelete } = useDeleteExperience();
  const { mutate: onSave } = useSaveExperience();
  const { mutate: onAdd } = useAddExperience();

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: experienceList?.totalPage,
    total: experienceList?.totalPage,
    onChangeSize: size => {
      setSize(size);
      setPage(1);
    },
    size: size,
  };

  const onSearch = async () => {
    setPage(1);
    await refetch();
  };

  const handleOnAdd = async values => {
    onAdd && onAdd(values);
    await refetch();
  };

  return (
    <ExperienceTemplate
      experienceList={experienceList}
      onSearch={onSearch}
      setPage={setPage}
      pageProps={PAGE_PROPS}
      onDelete={onDelete}
      onSave={onSave}
      onAdd={handleOnAdd}
    />
  );
}
ManageExperience.Layout = AdminLayout;
ManageExperience.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '경험',
};

export default ManageExperience;

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
