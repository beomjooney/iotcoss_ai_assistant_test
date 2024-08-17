import './index.module.scss';
import { StudyRoomTemplate } from 'src/templates';
import { useEffect } from 'react';

export function StudyRoomPage({ setActiveIndex }: { setActiveIndex: (index: number) => void }) {
  useEffect(() => {
    setActiveIndex(3);
  }, []);
  return (
    <div className="tw-h-[1800px]">
      <StudyRoomTemplate />
    </div>
  );
}

export default StudyRoomPage;

StudyRoomPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
