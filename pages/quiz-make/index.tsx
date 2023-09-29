import './index.module.scss';
import { QuizMakeTemplate } from 'src/templates';

export function QuizMakePage() {
  return <QuizMakeTemplate />;
}

export default QuizMakePage;

QuizMakePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
