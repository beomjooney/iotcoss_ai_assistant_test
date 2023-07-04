import './index.module.scss';
import { SeminarTemplate } from 'src/templates';

export function SeminarPage() {
  return <SeminarTemplate />;
}

export default SeminarPage;

SeminarPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
