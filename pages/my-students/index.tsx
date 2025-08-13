import './index.module.scss';
import { useEffect } from 'react';
import { MyStudentsTemplate } from 'src/templates';

export function MyStudentsPage({ setActiveIndex }: { setActiveIndex: (index: number) => void }) {
  useEffect(() => {
    setActiveIndex(7);
  }, []);

  return (
    <div className="tw-h-[1000px]">
      <MyStudentsTemplate />
    </div>
  );
}

export default MyStudentsPage;

MyStudentsPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
