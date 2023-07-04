import './index.module.scss';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useSkills } from 'src/services/admin/skill/skill.queries';
import AdminLayout from 'src/stories/Layout/AdminLayout';
import SkillsTemplate from 'src/templates/Admin/Contents/Skill';
import {
  useAddSkill,
  useDeleteSkill,
  useSaveSkill,
  useUpdateSkillExcel,
} from 'src/services/admin/skill/skill.mutations';

export function ManageSkill() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(25);

  const { data: skillsList, refetch }: UseQueryResult<any> = useSkills(
    paramsWithDefault({
      page: page,
      size: size,
    }),
  );

  const { mutate: onDelete } = useDeleteSkill();
  const { mutate: onSave } = useSaveSkill();
  const { mutate: onAdd } = useAddSkill();
  const { mutate: onUpdateExcel } = useUpdateSkillExcel();

  const PAGE_PROPS = {
    page: page,
    setPage: setPage,
    count: skillsList?.totalPage,
    total: skillsList?.totalPage,
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

  const handleOnUpdateExcel = async file => {
    onUpdateExcel && onUpdateExcel({ file });
    await refetch();
  };

  return (
    <SkillsTemplate
      skillsList={skillsList}
      onSearch={onSearch}
      setPage={setPage}
      pageProps={PAGE_PROPS}
      onDelete={onDelete}
      onSave={onSave}
      onAdd={handleOnAdd}
      onUpdateExcel={handleOnUpdateExcel}
    />
  );
}
ManageSkill.Layout = AdminLayout;
ManageSkill.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '스킬',
};

export default ManageSkill;

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
