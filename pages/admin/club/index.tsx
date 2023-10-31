import './index.module.scss';
import AdminLayout from '../../../src/stories/Layout/AdminLayout';
import { UseQueryResult } from 'react-query';
import { useEffect, useState } from 'react';
import {} from '../../../src/services/club/clubs.queries';
import { AdminClubTemplate } from '../../../src/templates';
import {} from '../../../src/services/club/clubs.mutations';
import { useJobGroups } from '../../../src/services/code/code.queries';

export function ClubPage() {
  return <AdminClubTemplate />;
}

export default ClubPage;

ClubPage.Layout = AdminLayout;
ClubPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스 관리자',
};

const paramsWithDefault = (params: any) => {
  const defaultParams: any = {
    page: 1,
    size: 15,
  };
  return {
    ...defaultParams,
    ...params,
  };
};
