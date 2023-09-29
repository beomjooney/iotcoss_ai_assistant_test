import './index.module.scss';
import { ContentsTemplate } from 'src/templates';

export function ContentsPage() {
  return <ContentsTemplate />;
}

export default ContentsPage;

ContentsPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
