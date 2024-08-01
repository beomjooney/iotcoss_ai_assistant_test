import './index.module.scss';
import { QuizMyLectureClubsTemplate } from 'src/templates';

export function QuizMyLectureClubsPage() {
  return (
    <div className="tw-h-[2000px]">
      <QuizMyLectureClubsTemplate />
    </div>
  );
}

export default QuizMyLectureClubsPage;

QuizMyLectureClubsPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
