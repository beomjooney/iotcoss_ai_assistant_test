import './index.module.scss';
import { StudyRoomTemplate } from 'src/templates';

export function StudyRoomPage() {
  return (
    <div className="tw-h-[2600px]">
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
