import './index.module.scss';
import { CommunityWriteTemplate } from 'src/templates';

export function CommunityPage() {
  return <CommunityWriteTemplate postData={undefined} />;
}

export default CommunityPage;

CommunityPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
