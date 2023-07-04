import React from 'react';
import { Meta, Story } from '@storybook/react';

import ImageCard, { ImageCardProps } from './index';

export default {
  title: 'Components/ImageCard',
  component: ImageCard,
} as Meta<ImageCardProps>;

const sample = {
  src: 'assets/img/blog/1.jpg',
  labels: ['SW개발', '스터디', '1레벨 추천'],
  isRecruit: true,
  title: '모여라 개발자들이여',
  tags: ['개발', '입문', '백엔드개발'],
  mentorName: '추병조',
  studyCount: 0,
};

const Template: Story = args => {
  return <ImageCard {...sample} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'Gildong Hong',
  job: 'UI Designer',
};
