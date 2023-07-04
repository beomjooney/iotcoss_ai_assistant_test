import React from 'react';
import { Meta, Story } from '@storybook/react';

import MentorPick, { MentorPickProps } from './index';

export default {
  title: 'Components/MentorPick',
  component: MentorPick,
} as Meta<MentorPickProps>;

const mentor1 = {
  memberId: 'memberId',
  jobGroupName: '디자인',
  level: 4,
  nickname: '홍길동',
  profileImageUrl: '/assets/img/team-2.jpg',
};

const Template: Story = args => {
  return <MentorPick mentorInfo={mentor1} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  mentorInfo: mentor1,
};
