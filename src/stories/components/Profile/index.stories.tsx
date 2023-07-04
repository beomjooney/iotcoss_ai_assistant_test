import React from 'react';
import { Meta, Story } from '@storybook/react';

import Profile, { ProfileProps } from './index';

export default {
  title: 'Components/Profile',
  component: Profile,
} as Meta<ProfileProps>;

const mentorDevleoper = {
  memberId: 'memberId',
  jobGroupName: 'SW개발',
  level: 4,
  nickname: '홍길동',
  profileImageUrl: 'default.jpg',
};

const mentorDesigner = { ...mentorDevleoper, jobGroupName: '디자인' };
const mentorPlanner = { ...mentorDevleoper, jobGroupName: '기획' };
const mentorEngineer = { ...mentorDevleoper, jobGroupName: '서비스운영' };

const Template: Story = args => {
  return <Profile mentorInfo={mentorDevleoper} {...args} />;
};

export const Default = Template.bind({});

export const Primary = Template.bind({});
Primary.args = {
  colorMode: 'primary',
  showDesc: true,
};

export const ShowDesc = Template.bind({});
ShowDesc.args = {
  showDesc: true,
};
