import './index.module.scss';
import { BusinessTemplate } from 'src/templates';

export function BusinessPage() {
  return <BusinessTemplate />;
}

export default BusinessPage;

BusinessPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
