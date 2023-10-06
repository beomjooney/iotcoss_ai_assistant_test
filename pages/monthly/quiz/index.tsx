import styled from './index.module.scss';
import { MonthlyQuizTemplate } from 'src/templates';

export function MonthlyQuizPage() {
  return <MonthlyQuizTemplate />;
}

export default MonthlyQuizPage;

MonthlyQuizPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
