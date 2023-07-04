import './index.module.scss';
import BannerTemplate from '../../../../src/templates/Admin/Banner';
import AdminLayout from '../../../../src/stories/Layout/AdminLayout';
import { UseQueryResult } from 'react-query';
import { useBanners } from '../../../../src/services/admin/banner/banner.queries';
import { useSaveBanner } from '../../../../src/services/admin/banner/banner.mutations';

export function BannerPage() {
  const { data: bannerList }: UseQueryResult<any> = useBanners();
  const { mutate: onSave } = useSaveBanner();

  const onSaveBanner = (data: any) => {
    if (confirm('저장하시겠습니까?')) {
      onSave(data);
    }
  };

  return <BannerTemplate bannerList={bannerList} onSaveBanner={onSaveBanner} />;
}

export default BannerPage;

BannerPage.Layout = AdminLayout;
BannerPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스 관리자',
};
