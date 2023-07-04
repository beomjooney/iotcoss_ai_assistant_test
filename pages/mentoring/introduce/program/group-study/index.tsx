import './index.module.scss';
import { MentorGroupStudyTemplate } from 'src/templates';

export function MentorGroupStudyPage() {
  return <MentorGroupStudyTemplate />;
}

export default MentorGroupStudyPage;

MentorGroupStudyPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
