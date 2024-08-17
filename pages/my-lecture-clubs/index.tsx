import './index.module.scss';
import { useEffect } from 'react';
import { QuizMyLectureClubsTemplate } from 'src/templates';

export function QuizMyLectureClubsPage({ setActiveIndex }: { setActiveIndex: (index: number) => void }) {
  useEffect(() => {
    setActiveIndex(6);
  }, []);

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
