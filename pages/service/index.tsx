import './index.module.scss';
import { ServiceTemplate } from 'src/templates';

export function ServicePage() {
  return <ServiceTemplate />;
}

export default ServicePage;

ServicePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
