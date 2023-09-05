import './index.module.scss';
import { QuizManageTemplate } from 'src/templates';

export function QuizManagePage() {
  return <QuizManageTemplate />;
}

export default QuizManagePage;

QuizManagePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
