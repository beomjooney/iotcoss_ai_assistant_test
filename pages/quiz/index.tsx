import './index.module.scss';
import { QuizTemplate } from 'src/templates';

export function SeminarPage() {
  return <QuizTemplate />;
}

export default SeminarPage;

SeminarPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
