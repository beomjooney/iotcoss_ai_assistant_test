import { Meta, Story } from '@storybook/react';
import ArticleCard, { ArticleCardProps } from './index';
import { RecommendContent } from 'src/models/recommend';
import { ArticleEnum } from 'src/config/types';

export default {
  title: 'Components/ArticleCard',
  component: ArticleCard,
} as Meta<ArticleCardProps>;

const growthContent1 = {
  contentsId: 'contentsId-1',
  provider: 'byw',
  contentsName: 'Java Basic',
  contentsType: ArticleEnum.ARTICLE,
  contentsTypeName: '아티클',
  description: '자바 기본 강의',
  url: 'https://test.com',
  recommendJobGroups: ['0001'],
  recommendJobGroupNames: ['SW개발'],
  recommendJobs: ['0001', '0002'],
  recommendJobNames: ['백엔드개발', '프론트개발'],
  recommendLevels: [1],
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
  imageUrl:
    'https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202111/141350-472/%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8---%EA%B9%80%EB%AF%BC%ED%83%9C%EB%8B%98-1%EA%B0%95.png',
  recommendQuotes: 50,
  internalRecommendLevel: 5,
  seminarType: '0001',
  seminarStartDate: '2022-05-05 12:12:12.000',
  seminarEndDate: '2022-07-05 12:12:12.000',
  seminarVenueType: '0001',
  createdAt: '2022-10-08 23:48:38.110',
  updatedAt: '2022-10-08 23:48:38.110',
} as RecommendContent;

const Template: Story = args => {
  return <ArticleCard uiType={ArticleEnum.ARTICLE} content={growthContent1} {...args} />;
};

export const VOD = Template.bind({});
VOD.args = {
  uiType: ArticleEnum.VOD,
};

export const Seminar = Template.bind({});
Seminar.args = {
  uiType: ArticleEnum.SEMINAR,
};

export const Article = Template.bind({});
Article.args = {
  uiType: ArticleEnum.ARTICLE,
};

export const MentorArticle = Template.bind({});
MentorArticle.args = {
  uiType: ArticleEnum.MENTOR_SEMINAR,
};
