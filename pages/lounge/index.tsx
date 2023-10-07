import './index.module.scss';
import { LoungeTemplate } from 'src/templates';

export function LoungePage() {
  return <LoungeTemplate />;
}

export default LoungePage;

LoungePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
