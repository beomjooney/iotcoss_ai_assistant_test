import './index.module.scss';
import { NavigationTemplate } from 'src/templates';

/* eslint-disable-next-line */
interface DiagramPageProps {}

export function NavigationPage() {
  return <NavigationTemplate />;
}

export default NavigationPage;

NavigationPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
