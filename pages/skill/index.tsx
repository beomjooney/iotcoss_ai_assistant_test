import './index.module.scss';
import { SkillTemplate } from 'src/templates';

export function SkillPage() {
  return <SkillTemplate />;
}

export default SkillPage;

SkillPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
