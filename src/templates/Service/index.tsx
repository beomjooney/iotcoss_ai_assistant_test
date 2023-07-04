import styles from './index.module.scss';
import classNames from 'classnames/bind';
import ArticleCard from 'src/stories/components/ArticleCard';
import Banner from 'src/stories/components/Banner';
import { Textfield, Pagination, Toggle } from 'src/stories/components';
import React, { useState } from 'react';
import { RecommendContent } from 'src/models/recommend';
import { ArticleEnum } from '../../config/types';

const cx = classNames.bind(styles);

// dummy data
const growthContent = {
  contentsId: 'contentsId-1',
  provider: 'byw',
  contentsName: 'Java Basic',
  contentsType: ArticleEnum.VOD,
  description: '자바 기본 강의',
  url: 'https://test.com',
  recommendJobGroups: ['0001', '0002'],
  recommendJobGroupNames: ['SW개발', '서비스운영'],
  recommendJobs: ['0001', '0002'],
  recommendJobNames: ['백엔드개발', '프론트개발'],
  recommendLevels: [1, 2, 3],
  estimatedViewTime: 100,
  paymentType: '0001',
  paymentTypeName: '무료',
  price: 50000,
  registDate: '2022-05-05 12:12:12.000',
  creator: 'byw',
  keywords: ['java', 'byw'],
  relatedSkills: ['0001'],
  relatedExperiences: ['0001'],
  memberRecommendCount: 100,
  memberViewCount: 500,
  imageUrl: 'https://test.com',
  recommendQuotes: 50,
  internalRecommendLevel: 5,
  seminarType: '0001',
  seminarStartDate: '2022-05-05 12:12:12.000',
  seminarEndDate: '2022-07-05 12:12:12.000',
  seminarVenueType: '0001',
  createdAt: '2022-10-08 23:48:38.110',
  updatedAt: '2022-10-08 23:48:38.110',
} as RecommendContent;
let datas = [];
for (let i = 0; i < 15; i++) {
  datas.push(growthContent);
}

export function ServiceTemplate() {
  const [page, setPage] = useState(1);

  return (
    <div className={cx('service-container')}>
      <Banner title="성장서비스 추천" />
      <div className={cx('service-container', 'container pl-5 pr-5')}>
        <article>
          {/*todo 컴포넌트 분리 필요 -> 기획 확정안 답변 올 경우 = 커리어멘토링/추천 서비스에 일괄 적용*/}
          <div className={cx('filter-area', 'row pb-5')}>
            <div className={cx('mentoring-button__group', 'col-md-8')}>
              <Toggle
                label="전체"
                name="mentoring"
                value="ALL"
                variant="small"
                isActive
                className={cx('fixed-width')}
              />
              <Toggle
                label="기획"
                name="mentoring"
                value="ALL"
                variant="small"
                isActive
                className={cx('fixed-width')}
              />
              <Toggle
                label="디자인"
                name="mentoring"
                value="ALL"
                variant="small"
                isActive
                className={cx('fixed-width')}
              />
              <Toggle
                label="SW개발"
                name="mentoring"
                value="ALL"
                variant="small"
                isActive
                className={cx('fixed-width')}
              />
              <Toggle
                label="서비스 운영/관리"
                name="mentoring"
                value="ALL"
                variant="small"
                isActive
                className={cx('fixed-width')}
              />
            </div>
            <div className="col-md-4">
              <Textfield defaultValue="" placeholder="키워드로 검색해보세요." />
            </div>
          </div>
          <hr />
          <section className={cx('content')}>
            {datas.map((data, i) => {
              return (
                <ArticleCard
                  uiType={growthContent.contentsType}
                  content={data}
                  key={i}
                  className={cx('container__item')}
                />
              );
            })}
          </section>
          <Pagination page={page} />
        </article>
      </div>
    </div>
  );
}

export default ServiceTemplate;
