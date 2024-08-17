import './index.module.scss';
import { LectureTemplate } from 'src/templates';
import { useEffect } from 'react';

export function LecturePage({ setActiveIndex }: { setActiveIndex: (index: number) => void }) {
  useEffect(() => {
    setActiveIndex(2);
  }, []);
  return <LectureTemplate />;
}

export default LecturePage;

LecturePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
