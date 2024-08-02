import './index.module.scss';
import { LectureOpenTemplate } from 'src/templates';

export function LectureOpenPage() {
  return <LectureOpenTemplate />;
}

export default LectureOpenPage;

LectureOpenPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
