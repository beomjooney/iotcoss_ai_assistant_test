import './index.module.scss';
import { QuizMakeTemplate } from 'src/templates';
import { useEffect } from 'react';

export function QuizMakePage({ setActiveIndex }: { setActiveIndex: (index: number) => void }) {
  useEffect(() => {
    setActiveIndex(4);
  }, []);

  return <QuizMakeTemplate />;
}

export default QuizMakePage;

QuizMakePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
