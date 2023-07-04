import './index.module.scss';
import { CommunityTemplate } from 'src/templates';

export function CommunityPage() {
  return <CommunityTemplate />;
}

export default CommunityPage;

CommunityPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
