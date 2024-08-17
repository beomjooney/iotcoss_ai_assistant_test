import './index.module.scss';
import { QuizMyTemplate } from 'src/templates';
import { useEffect } from 'react';

export function QuizMyPage({ setActiveIndex }: { setActiveIndex: (index: number) => void }) {
  useEffect(() => {
    setActiveIndex(5);
  }, []);

  return (
    <div className="tw-h-[2000px]">
      <QuizMyTemplate />
    </div>
  );
}

export default QuizMyPage;

QuizMyPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
