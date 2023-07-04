import { QueryClient, QueryClientProvider } from 'react-query';
import styles from './index.module.scss';
import SkillList from 'src/components/skill-list/SkillList';
import Banner from 'src/stories/components/Banner';
import SectionHeader from 'src/stories/components/SectionHeader';
import classNames from 'classnames/bind';
/* eslint-disable-next-line */
interface ListPageProps {}
const cx = classNames.bind(styles);

export function SkillTemplate(props: ListPageProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <section className="hero-section hero-section-3">
        <Banner title="스킬/경험 소개" subTitle="커리어네비게이션 > 스킬 / 경험 소개" imageName="top_banner_navi.svg" />
      </section>
      <article className="pt-100">
        <div className={cx('container')} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
          <div className="row justify-content-center">
            <div className="section-heading">
              <SectionHeader title="스킬/경험 소개" subTitle="SKILLS & EXPERIENCE" />
              <SkillList />
            </div>
          </div>
        </div>
      </article>
    </QueryClientProvider>
  );
}

export default SkillTemplate;
