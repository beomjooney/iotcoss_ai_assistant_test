import './index.module.scss';
import { SkillTemplate } from 'src/templates';

export function SkillPage() {
  return <SkillTemplate />;
}

export default SkillPage;

SkillPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
