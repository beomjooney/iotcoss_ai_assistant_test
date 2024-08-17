import './index.module.scss';
import { QuizTemplate } from 'src/templates';
import { useEffect } from 'react';

export function QuizPage({ setActiveIndex }: { setActiveIndex: (index: number) => void }) {
  useEffect(() => {
    setActiveIndex(1);
  }, []);
  return <QuizTemplate />;
}

export default QuizPage;

QuizPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
