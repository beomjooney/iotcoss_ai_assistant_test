import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Chip from 'src/stories/components/Chip';
import Button from 'src/stories/components/Button';
import ArticleCard from 'src/stories/components/ArticleCard';
import { ArticleEnum } from 'src/config/types';
import { RecommendContent } from 'src/models/recommend';

const cx = classNames.bind(styles);

export function MyLearningTemplate() {
  // TODO 컨텐츠 더미 데이터
  const data = [
    {
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
    },
    {
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
    },
  ] as RecommendContent[];
  // TODO 카테고리 더미 데이터 - query 적용해서 API 호출 필요?
  const categories = [
    { no: 0, title: 'VOD', link: '' },
    { no: 1, title: 'TOPIC', link: '' },
    { no: 2, title: '세미나', link: '' },
    { no: 3, title: '추천사이트', link: '' },
  ];
  // TODO 기능 개발 시 수정 필요
  let current = categories[0];
  const isCurrent = category => current === category;

  return (
    <article className={cx('main-container')}>
      <section className={cx('category-area')}>
        {categories.map(category => {
          return (
            <Chip
              key={category.no}
              chipColor="primary"
              variant="filled"
              radius={4}
              onClick={() => (current = category)}
              className={cx({
                'category-area__item': true,
                'category-area__item--active': isCurrent(category),
              })}
            >
              {category.title}
            </Chip>
          );
        })}
      </section>
      <section className={cx('learning-area')}>
        {data.map(item => {
          return <ArticleCard uiType={item.contentsType} key={item.contentsId} content={item} mdSize="col-md-6" />;
        })}
      </section>
      <div className={cx('button-area')}>
        <Button color="primary" label={`더 많은 ${current.title} 보러가기 >`} size="large" />
      </div>
    </article>
  );
}
