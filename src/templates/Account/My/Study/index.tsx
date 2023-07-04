import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Button, ImageCard } from '../../../../stories/components';

const cx = classNames.bind(styles);

export function StudyTemplate() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-12">
        <ImageCard
          src="/assets/images/blog/01.jpg"
          isRecruit={true}
          mentorName="추병조"
          studyCount={5}
          tags={['입문', '개발']}
          title="모여라 개발자들이여"
        />
      </div>
      <div className="col-md-6 mt-lg-5">
        <Button type="button" size="large">
          다른 그룹 스터디 보러가기 {'>'}
        </Button>
      </div>
    </div>
  );
}

export default StudyTemplate;
