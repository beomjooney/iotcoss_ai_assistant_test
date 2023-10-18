import { Meta, Story } from '@storybook/react';
import CommunityCardReply, { CommunityCardReplyProps } from './index';
import { authorType, ReplyType } from 'src/config/entities';
import { User } from 'src/models/user';
import { JobGroupEnum } from 'src/config/types';

export default {
  title: 'Components/CommunityCareReply',
  component: CommunityCardReply,
} as Meta<CommunityCardReplyProps>;

const memberSample = {
  memberId: 'memberId1@email.com',
  name: '회원1',
  nickname: '닉네임1',
  email: 'memberId1@email.com',
  ageRange: '30~39',
  birthday: '0123',
  type: '0001',
  jobGroup: '0001',
  level: 3,
  profileImageUrl: 'profile@test.com',
  authProvider: 'KAKAO',
  snsUrl: ['sns@test.com'],
  loginFailCount: 0,
} as User;

const authorSample = {
  memberId: 'bluefrozen2@gmail.com',
  nickname: '방영우',
  type: '0001',
  typeName: '멘티',
  jobGroup: '0300',
  jobGroupName: '개발',
  level: 3,
  profileImageUrl: 'mentor/byw.jpg',
  introductionMessage: '안녕하세요!',
} as authorType;

const replySample = {
  postReplyNo: 1,
  parentPostNo: 1,
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices risus venenatis, quis turpis odio orci consequat, et',
  writerID: 'uuid',
  createdAt: new Date(),
  updatedAt: new Date(),
  author: authorSample,
} as ReplyType;

const Template: Story = args => {
  return (
    <CommunityCardReply
      memberId={''}
      onReplyDeleteSubmit={function (...args: any[]) {
        throw new Error('Function not implemented.');
      }}
      reply={replySample}
      writer={memberSample}
      {...args}
    />
  );
};

export const Planner = Template.bind({});
const planner = {
  ...memberSample,
  career: {
    categoryGroupName: JobGroupEnum.Plan,
  },
};
Planner.args = {
  writer: planner,
};

export const Designer = Template.bind({});
const designer = {
  ...memberSample,
  career: {
    categoryGroupName: JobGroupEnum.Design,
  },
};
Designer.args = {
  writer: designer,
};

export const Developer = Template.bind({});
const developer = {
  ...memberSample,
  career: {
    categoryGroupName: JobGroupEnum.Develop,
  },
};
Developer.args = {
  writer: developer,
};

export const Engineer = Template.bind({});
const engineer = {
  ...memberSample,
  career: {
    categoryGroupName: JobGroupEnum.Engineering,
  },
};
Engineer.args = {
  writer: engineer,
};
