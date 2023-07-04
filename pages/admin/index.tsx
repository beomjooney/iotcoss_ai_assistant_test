import './index.module.scss';
import AdminLayout from '../../src/stories/Layout/AdminLayout';
import AdminIndexTemplate from '../../src/templates/Admin';

export function AdminIndexPage({ error }) {
  return <AdminIndexTemplate />;
}

export default AdminIndexPage;

AdminIndexPage.Layout = AdminLayout;
AdminIndexPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스 관리자',
};

export async function getServerSideProps({ req }) {
  if (!req.headers.referer) {
    return { props: { error: true } };
  }
  return { props: { error: false } };
}
