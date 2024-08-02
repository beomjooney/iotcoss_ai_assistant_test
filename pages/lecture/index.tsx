import './index.module.scss';
import { LectureTemplate } from 'src/templates';

export function LecturePage() {
  return <LectureTemplate />;
}

export default LecturePage;

LecturePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
