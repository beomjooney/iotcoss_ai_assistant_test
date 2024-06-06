import './index.module.scss';
import { QuizMyTemplate } from 'src/templates';

export function QuizMyPage() {
  return <QuizMyTemplate />;
}

export default QuizMyPage;

QuizMyPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
