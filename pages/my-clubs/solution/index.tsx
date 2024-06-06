import './index.module.scss';
import { QuizSolutionTemplate } from 'src/templates';

export function QuizSolutionPage() {
  return <QuizSolutionTemplate />;
}

export default QuizSolutionPage;

QuizSolutionPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
