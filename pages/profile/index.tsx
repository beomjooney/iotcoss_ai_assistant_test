import './index.module.scss';
import { ProfileTemplate } from 'src/templates';

export function ProfilePage() {
  return <ProfileTemplate />;
}

export default ProfilePage;

ProfilePage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
