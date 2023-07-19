import './index.module.scss';
import { QuizTemplate } from 'src/templates';

export function QuizPage() {
  return <QuizTemplate />;
}

export default QuizPage;

QuizPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
