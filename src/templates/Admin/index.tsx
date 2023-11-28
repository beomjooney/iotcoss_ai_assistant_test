import styles from './index.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export function AdminIndexTemplate() {
  return (
    <div className="admin-content">
      <h2 className="tit-type1">대시보드</h2>
      <div className="path">
        <span>Home</span> <span>대시보드</span>
      </div>
    </div>
  );
}

export default AdminIndexTemplate;
