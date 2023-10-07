import styled from './index.module.scss';
import { MonthlyMakerTemplate } from 'src/templates';

export function MonthlyMakerPage() {
  return <MonthlyMakerTemplate />;
}

export default MonthlyMakerPage;

MonthlyMakerPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
