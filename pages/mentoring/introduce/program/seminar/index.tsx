import './index.module.scss';
import { MentorSeminarTemplate } from 'src/templates';

export function MentorSeminarPage() {
  return <MentorSeminarTemplate />;
}

export default MentorSeminarPage;

MentorSeminarPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
