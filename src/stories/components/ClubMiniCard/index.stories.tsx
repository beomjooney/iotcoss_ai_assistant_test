import { Meta, Story } from '@storybook/react';
import ClubCard, { ClubCardProps } from './index';
import { authorType, BoardType, ReplyType } from 'src/config/entities';
import { User } from '../../../models/user';

export default {
  title: 'Components/ClubCard',
  component: ClubCard,
} as Meta<ClubCardProps>;

const boardSample = {
  postNo: 1,
  categoryId: 1,
  title: '게시판 생픔',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices risus venenatis, quis turpis odio orci consequat, et integer. Massa, aliquam ut duis ornare dui. Tellus massa elementum arcu vulputate. Metus eu porttitor est mattis.',
  writerID: 'userId',
  reactionCount: 12,
  createdAt: new Date(),
  keywords: ['tag1', 'tag2'],
  liked: true,
} as BoardType;

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

const replies = [
  {
    postReplyNo: 1,
    parentPostNo: 1,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices risus venenatis, quis turpis odio orci consequat, et',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: authorSample,
  },
  {
    postReplyNo: 2,
    parentPostNo: 1,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices risus venenatis, quis turpis odio orci consequat, et',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: authorSample,
  },
] as ReplyType[];

const Template: Story = args => {
  return (
    <ClubCard
      onPostDeleteSubmit={function (...args: any[]) {
        throw new Error('Function not implemented.');
      }}
      memberId={''}
      board={boardSample}
      writer={memberSample}
      {...args}
    />
  );
};

export const NoReply = Template.bind({});

export const containReply = Template.bind({});
containReply.args = {
  replies,
  onReplySubmit: comment => alert(comment),
};
