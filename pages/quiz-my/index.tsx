import './index.module.scss';
import { QuizMyTemplate } from 'src/templates';

export function QuizMyPage() {
  return <QuizMyTemplate />;
}

export default QuizMyPage;

QuizMyPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
