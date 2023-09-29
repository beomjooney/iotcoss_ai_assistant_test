import './index.module.scss';
import { JoinTemplate } from 'src/templates';

/* eslint-disable-next-line */
interface JoinPageProps {}

export function JoinPage(props: JoinPageProps) {
  return <JoinTemplate />;
}

export default JoinPage;

JoinPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '데브어스',
};
