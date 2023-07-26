import './index.module.scss';
import { QuizOpenTemplate } from 'src/templates';

export function QuizOpenPage() {
  return <QuizOpenTemplate />;
}

export default QuizOpenPage;

QuizOpenPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
